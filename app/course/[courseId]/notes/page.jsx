"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import rehypeHighlight from "rehype-highlight";
import { useUser } from "@clerk/nextjs";

function parseNotes(notesString) {
  if (typeof notesString !== "string") return "Invalid content";

  try {
    const parsed = JSON.parse(notesString);
    let content = "";

    if (parsed.chapter_name) {
      content += `## ${parsed.chapter_name}\n\n`;
    }

    if (parsed.chapter_summary) {
      content += `${parsed.chapter_summary}\n\n`;
    }

    const topics = parsed.topics || [];
    for (const topic of topics) {
      if (topic.topic_title) content += `### ${topic.topic_title}\n\n`;
      if (Array.isArray(topic.content)) {
        for (const sub of topic.content) {
          if (sub.subtopic) content += `**${sub.subtopic}**\n\n`;
          if (Array.isArray(sub.details)) {
            for (const detail of sub.details) {
              const isCode = detail.includes("function") || detail.includes("{") || detail.includes("=>");
              if (isCode) content += `\n\`\`\`js\n${detail}\n\`\`\`\n\n`;
              else content += `- ${detail}\n`;
            }
          }
        }
      }
    }

    return content.trim() || "No content available";
  } catch (error) {
    console.error("🚨 Error parsing JSON:", error);
    return "Invalid content format";
  }
}

function ViewNotes() {
  const { courseId } = useParams();
  const router = useRouter();
  const { user } = useUser();

  const [stepCount, setStepCount] = useState(1);
  const [noteContent, setNoteContent] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const fetchNote = async (chapterId, isInitial = false) => {
    try {
      if (isInitial) setInitialLoading(true);
      const res = await axios.get("/api/study-type/chapter-notes", {
        params: { courseId, chapterId },
      });

      if (!res.data.content) {
        setIsEnd(true);
        setNoteContent("");
      } else {
        setNoteContent(parseNotes(res.data.content));
        setIsEnd(false);
      }
    } catch (err) {
      console.error("❌ Failed to fetch chapter note:", err);
      setNoteContent("Error loading content.");
    } finally {
      if (isInitial) setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (stepCount === 1) {
      fetchNote(stepCount, true);
    } else {
      fetchNote(stepCount);
    }
  }, [stepCount]);

  const handleNext = () => {
    setStepCount((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevious = () => {
    if (stepCount > 1) {
      setStepCount((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="mt-10">
      {initialLoading ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600" />
        </div>
      ) : isEnd ? (
        <div className="text-center flex flex-col items-center gap-5 min-h-[300px] justify-center">
          <h2 className="mt-10 text-6xl font-semibold">End of Notes</h2>
          <Button
            className="mt-4"
            onClick={async () => {
              try {
                await axios.post("/api/progress", {
                  userId: user?.id,
                  courseId,
                  type: "notes",
                  value: true,
                });
              } catch (error) {
                console.error("Failed to update progress:", error);
              } finally {
                router.back();
              }
            }}
          >
            Go to Course Page
          </Button>
        </div>
      ) : (
        <>
          <div className="prose prose-sm md:prose-md lg:prose-lg max-w-none">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {noteContent}
            </ReactMarkdown>
          </div>

          <div>
            {stepCount > 1 && (
              <Button
                variant="outline"
                className="fixed top-1/2 left-4 transform -translate-y-1/2 ml-6"
                onClick={handlePrevious}
              >
                <FaArrowLeftLong />
              </Button>
            )}
            <Button
              variant="outline"
              className="fixed top-1/2 right-4 transform -translate-y-1/2 mr-6"
              onClick={handleNext}
              disabled={isEnd}
            >
              <FaArrowRightLong />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default ViewNotes;
