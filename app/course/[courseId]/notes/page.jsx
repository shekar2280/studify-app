"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import rehypeHighlight from "rehype-highlight";
import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
const MermaidChart = dynamic(() => import("../_components/MermaidChart"), {
  ssr: false,
});

function sanitizeMermaid(diagram) {
  // Wrap square-bracketed nodes with parentheses in quotes
  diagram = diagram.replace(/\[([^\]]*\([^)]*\)[^\]]*)\]/g, '["$1"]');

  // Wrap curly-brace nodes with parentheses/commas/slashes in quotes
  diagram = diagram.replace(/\{([^}]*[\(\),\/][^}]*)\}/g, '{"$1"}');

  return diagram;
}

function parseNotes(notesString) {
  if (typeof notesString !== "string")
    return { markdown: "Invalid content", diagram: null };

  try {
    const parsed = JSON.parse(notesString);
    let content = "";

    if (parsed.chapter_name) content += `## ${parsed.chapter_name}\n\n`;
    if (parsed.chapter_summary) content += `${parsed.chapter_summary}\n\n`;

    const topics = parsed.topics || [];
    for (const topic of topics) {
      if (topic.topic_title) content += `### ${topic.topic_title}\n\n`;
      if (Array.isArray(topic.content)) {
        for (const sub of topic.content) {
          if (sub.subtopic) content += `**${sub.subtopic}**\n\n`;
          if (Array.isArray(sub.details)) {
            for (const detail of sub.details) {
              const isCode =
                detail.includes("function") ||
                detail.includes("{") ||
                detail.includes("=>");
              if (isCode) content += `\n\`\`\`js\n${detail}\n\`\`\`\n\n`;
              else content += `- ${detail}\n`;
            }
          }
        }
      }
    }

    return {
      markdown: content.trim() || "No content available",
      diagram: parsed.diagram_mermaid
        ? sanitizeMermaid(parsed.diagram_mermaid.replace(/```/g, "").trim())
        : null,
    };
  } catch (error) {
    console.error("🚨 Error parsing JSON:", error);
    return { markdown: "Invalid content format", diagram: null };
  }
}

function ViewNotes() {
  const { courseId } = useParams();
  const router = useRouter();
  const { user } = useUser();

  const [stepCount, setStepCount] = useState(1);
  const [noteContent, setNoteContent] = useState({
    markdown: "",
    diagram: null,
  });
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
    <div className="mt-10 mb-15">
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
          <div className="prose prose-sm md:prose-md lg:prose-lg max-w-none pb-20">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {noteContent.markdown}
            </ReactMarkdown>

            {noteContent.diagram && (
              <MermaidChart chart={noteContent.diagram} />
            )}
          </div>

          <div>
            {stepCount > 1 && (
              <Button
                variant="outline"
                className="hidden md:flex fixed top-1/2 left-4 -translate-y-1/2 ml-6"
                onClick={handlePrevious}
              >
                <FaArrowLeftLong />
              </Button>
            )}
            <Button
              variant="outline"
              className="hidden md:flex fixed top-1/2 right-4 -translate-y-1/2 mr-6"
              onClick={handleNext}
              disabled={isEnd}
            >
              <FaArrowRightLong />
            </Button>

            <div className="flex md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-3 justify-between">
              {stepCount > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex-1 mr-2"
                >
                  <FaArrowLeftLong className="mr-1" /> Prev
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleNext}
                disabled={isEnd}
                className="flex-1 ml-2"
              >
                Next <FaArrowRightLong className="ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ViewNotes;
