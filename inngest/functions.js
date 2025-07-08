import { db } from "@/configs/db";
import { inngest } from "./client";
import {
  CHAPTER_NOTES_TABLE,
  STUDY_MATERIAL_TABLE,
  STUDY_TYPE_CONTENT_TABLE,
  USER_TABLE,
} from "@/configs/schema";
import { eq } from "drizzle-orm";
import {
  generateNotesAiModel,
  GenerateQAAiModel,
  GenerateQuizAiModel,
  generateStudyTypeContentAiModel,
  courseOutlineAIModel,
} from "@/configs/AImodel";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const CreateNewUser = inngest.createFunction(
  { id: "create-user" },
  { event: "user.create" },
  async ({ event, step }) => {
    const { user } = event.data;

    const result = await step.run(
      "Check User and create New if Not in DB",
      async () => {
        const existingUser = await db
          .select()
          .from(USER_TABLE)
          .where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress));

        if (existingUser?.length === 0) {
          return await db
            .insert(USER_TABLE)
            .values({
              name: user?.fullName,
              email: user?.primaryEmailAddress?.emailAddress,
            })
            .returning({ id: USER_TABLE.id });
        }

        return existingUser;
      }
    );

    return "User Authentication Successfully Completed";
  }
);

export const GenerateNotes = inngest.createFunction(
  { id: "generate-course" },
  { event: "notes.generate" },
  async ({ event, step }) => {
    const { course } = event.data;

    console.log("📌 Received Course Data:", JSON.stringify(course, null, 2));

    if (!course || !course.courseId || !course.courseLayout?.chapters) {
      console.error("🚨 Missing course data!");
      throw new Error("Invalid course data received.");
    }

    const generateChapterNotes = async (chapter, index) => {
      console.log(
        `📝 Generating Notes for Chapter ${index + 1}: ${chapter.chapter_name}`
      );

      const [insertedNote] = await db
        .insert(CHAPTER_NOTES_TABLE)
        .values({
          chapterId: index + 1,
          courseId: course.courseId,
          notes: "",
          status: "Generating",
        })
        .returning({ id: CHAPTER_NOTES_TABLE.id });

      const PROMPT = `Generate detailed notes for the chapter: ${JSON.stringify(
        chapter
      )}`;
      const result = await generateNotesAiModel.sendMessage(PROMPT);

      const aiResp = await result.response.text();

      if (!aiResp || aiResp.trim().length === 0) {
        console.error(`Empty AI response for Chapter ${index + 1}`);
        throw new Error("AI returned empty notes.");
      }
      await db
        .update(CHAPTER_NOTES_TABLE)
        .set({ notes: aiResp, status: "Ready" })
        .where(eq(CHAPTER_NOTES_TABLE.id, insertedNote.id));
    };

    await step.run("Generate Chapter Notes", async () => {
      const Chapters = course?.courseLayout?.chapters;

      for (let index = 0; index < Chapters.length; index++) {
        await generateChapterNotes(Chapters[index], index);
      }
      return "Completed";
    });
  }
);

export const GenerateStudyTypeContent = inngest.createFunction(
  { id: "Generate Study Type Content" },
  { event: "studyType.content" },
  async ({ event, step }) => {
    const { studyType, prompt, courseId, recordId } = event.data;

    if (!prompt || prompt.trim().length === 0) {
      throw new Error("Invalid prompt: The prompt must not be empty.");
    }

    const AiResult = await step.run(
      "Generate Study Type Content using AI",
      async () => {
        try {
          console.log(
            "Prompt being sent to AI:",
            JSON.stringify(prompt, null, 2)
          );
          const result =
            studyType === "Flashcards"
              ? await generateStudyTypeContentAiModel.sendMessage(prompt)
              : studyType === "Quiz"
              ? await GenerateQuizAiModel.sendMessage(prompt)
              : await GenerateQAAiModel.sendMessage(prompt);

          return JSON.parse(result.response.text());
        } catch (error) {
          console.error("AI Model Error:", error);
          throw new Error("Failed to generate study type content");
        }
      }
    );

    await step.run("Save Result to DB", async () => {
      await db
        .update(STUDY_TYPE_CONTENT_TABLE)
        .set({ content: AiResult, status: "Ready" })
        .where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId));

      return "Data Inserted";
    });
  }
);

export const generateCourseOutline = inngest.createFunction(
  { id: "generate-course-outline" },
  { event: "course.generateOutline" },
  async ({ event }) => {
    const { recordId, topic, courseType, difficultyLevel } = event.data;

    const PROMPT = `Generate a study material for ${topic} for ${courseType} with difficulty level ${difficultyLevel}. 
    Provide:
    1. A summary of the course.
    2. A list of chapters with summaries and an emoji icon for each.
    3. Subtopics for each chapter.
    Return JSON format only.`;

    try {
      const aiResp = await courseOutlineAIModel.sendMessage(PROMPT);
      const aiResult = JSON.parse(await aiResp.response.text());

      const existingCourse = await db
        .select({ courseId: STUDY_MATERIAL_TABLE.courseId })
        .from(STUDY_MATERIAL_TABLE)
        .where(eq(STUDY_MATERIAL_TABLE.id, recordId));

      if (
        !existingCourse ||
        existingCourse.length === 0 ||
        !existingCourse[0].courseId
      ) {
        console.error("Course not found or courseId missing!");
        throw new Error("Course not found in the database.");
      }

      await db
        .update(STUDY_MATERIAL_TABLE)
        .set({ courseLayout: aiResult, status: "Ready" })
        .where(eq(STUDY_MATERIAL_TABLE.id, recordId));

      await inngest.send({
        name: "notes.generate",
        data: {
          course: {
            courseId: existingCourse[0].courseId,
            courseLayout: aiResult,
          },
        },
      });

    } catch (error) {
      console.error("AI Generation Error:", error.message);
      await db
        .update(STUDY_MATERIAL_TABLE)
        .set({ status: "failed" })
        .where(eq(STUDY_MATERIAL_TABLE.id, recordId));
    }
  }
);
