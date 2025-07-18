"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";
import rehypeHighlight from "rehype-highlight";
import { SiBookstack } from "react-icons/si";
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
      if (topic.topic_title) {
        content += `### ${topic.topic_title}\n\n`;
      }

      if (Array.isArray(topic.content)) {
        for (const sub of topic.content) {
          if (sub.subtopic) {
            content += `**${sub.subtopic}**\n\n`;
          }

          if (Array.isArray(sub.details)) {
            for (const detail of sub.details) {
              const isCode =
                detail.includes("function") ||
                detail.includes("{") ||
                detail.includes("=>");
              if (isCode) {
                content += `\n\`\`\`js\n${detail}\n\`\`\`\n\n`;
              } else {
                content += `- ${detail}\n`;
              }
            }
            content += `\n`;
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
  const [notes, setNotes] = useState([]);
  const [stepCount, setStepCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useUser();

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/study-type", {
        courseId,
        studyType: "notes",
      });

      const sortedNotes = data
        .map((item) => ({
          chapterId: item.chapterId,
          content: parseNotes(item.notes),
        }))
        .sort((a, b) => a.chapterId - b.chapterId);

      setNotes(sortedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const notesWithEnd = [...notes, { chapterId: -1, content: null }];

  const handleNext = () => {
    if (stepCount < notesWithEnd.length - 1) {
      setStepCount((prev) => prev + 1);
      scrollToTop();
    }
  };

  const handlePrevious = () => {
    if (stepCount > 0) {
      setStepCount((prev) => prev - 1);
      scrollToTop();
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600" />
        </div>
      ) : notes.length === 0 ? (
        <div className="flex items-center gap-10 flex-col justify-center">
          <h2 className="text-5xl mt-20 font-semibold"> No Notes Found</h2>
          <Button className="mb-10" onClick={() => router.back()}>
            Go to Course Page
          </Button>
        </div>
      ) : (
        <div className="mt-10">
          {stepCount === notesWithEnd.length - 1 ? (
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
              <div className="prose prose-xs md:prose-sm lg:prose-lg max-w-none">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {notesWithEnd[stepCount]?.content}
                </ReactMarkdown>
              </div>

              <div>
                {stepCount > 0 && (
                  <Button
                    variant="outline"
                    className="fixed top-1/2 left-4 transform -translate-y-1/2 ml-6"
                    onClick={handlePrevious}
                  >
                    <FaArrowLeftLong />
                  </Button>
                )}

                {notesWithEnd.map((_, index) => (
                  <div key={index}></div>
                ))}

                <Button
                  variant="outline"
                  className="fixed top-1/2 right-4 transform -translate-y-1/2 mr-6"
                  onClick={handleNext}
                  disabled={stepCount >= notesWithEnd.length - 1}
                >
                  <FaArrowRightLong />
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ViewNotes;
