import { db } from "@/configs/db";
import { inngest } from "./client";
import {
  CHAPTER_NOTES_TABLE,
  STUDY_MATERIAL_TABLE,
  STUDY_TYPE_CONTENT_TABLE,
  USER_TABLE,
} from "@/configs/schema";
import { eq } from "drizzle-orm";
import { generateNotesAiModel, GenerateQAAiModel, GenerateQuizAiModel, generateStudyTypeContentAiModel } from "@/configs/AImodel";

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
    // Get Event Data
    const result = await step.run(
      "Check User and create New if Not in DB",
      async () => {
        const result = await db
          .select()
          .from(USER_TABLE)
          .where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress));

        if (result?.length == 0) {
          const userResp = await db
            .insert(USER_TABLE)
            .values({
              name: user?.fullName,
              email: user?.primaryEmailAddress?.emailAddress,
            })
            .returning({ id: USER_TABLE.id });
          return userResp;
        }
        return result;
      }
    );
    return "Success";
  }
);

export const GenerateNotes = inngest.createFunction(
  { id: "generate-course", timeout: "10m" },
  { event: "notes.generate" },
  async ({ event, step }) => {
    const { course } = event.data;

    const generateChapterNotes = async (chapter, index) => {
      const PROMPT = `Generate exam material detail content for each chapter... ${JSON.stringify(chapter)}`;
      const result = await generateNotesAiModel.sendMessage(PROMPT);
      const aiResp = result.response.text();

      await db.insert(CHAPTER_NOTES_TABLE).values({
        chapterId: index,
        courseId: course?.courseId,
        notes: aiResp,
      });

      return aiResp;
    };

    const notesResult = await step.run("Generate Chapter Notes", async () => {
      const Chapters = course?.courseLayout?.chapters;
      if (!Chapters) throw new Error("No chapters found");

      // **Run all AI requests in parallel**
      await Promise.all(
        Chapters.map((chapter, index) => generateChapterNotes(chapter, index))
      );

      return "Completed";
    });

    await step.run("Update Course Status to Ready", async () => {
      await db.update(STUDY_MATERIAL_TABLE)
        .set({ status: "Ready" })
        .where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));
    });

    return { status: "Success" };
  }
);


export const GenerateStudyTypeContent = inngest.createFunction(
  { id: "Generate Study Type Content", timeout: "10m" },
  { event: "studyType.content" },
  async ({ event, step }) => {
    const { studyType, prompt, courseId, recordId } = event.data;

    if (!prompt || prompt.trim().length === 0) {
      throw new Error("Invalid prompt: The prompt must not be empty.");
    }

    const AiResult = await step.run('Generate Flashcard using AI', async () => {
      try {
        console.log("Prompt being sent to AI:", JSON.stringify(prompt, null, 2));

        const result = 
          studyType == 'Flashcards' ? await generateStudyTypeContentAiModel.sendMessage(prompt) :
          studyType == 'Quiz' ? await GenerateQuizAiModel.sendMessage(prompt) :
          await GenerateQAAiModel.sendMessage(prompt);

        const textResponse = await result.response.text(); 
        let AIResult;

        try {
          AIResult = JSON.parse(textResponse);
        } catch (error) {
          console.error("AI Response is not valid JSON:", textResponse);
          throw new Error("AI returned invalid JSON.");
        }

        return AIResult;
      } catch (error) {
        console.error("AI Model Error:", error);
        throw new Error("Failed to generate study type content requested");
      }
    });

    await step.run('Save Result to DB', async () => {
      await db.update(STUDY_TYPE_CONTENT_TABLE)
        .set({ content: AiResult, status: 'Ready' })
        .where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId));
    });

    return { status: "Success" };
  }
);



