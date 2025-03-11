"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";

function parseNotes(notesString) {
  if (typeof notesString !== "string") return "Invalid content";

  try {
    const parsed = JSON.parse(notesString);
    let content = "";

    if (parsed.chapter_name) {
      content += `## ${parsed.emoji || ""} ${parsed.chapter_name}\n\n`;
    }
    if (parsed.chapter_summary) {
      content += `${parsed.chapter_summary}\n\n`;
    }

    const sections = parsed.topics || parsed.subtopics || [];

    if (Array.isArray(sections)) {
      sections.forEach((section) => {
        const sectionTitle = section.title || section.topic_title;
        if (sectionTitle) {
          content += `### ${sectionTitle}\n\n`;
        }

        if (typeof section.content === "string" && section.content.trim() !== "") {
          content += `${section.content}\n\n`;
        } else if (Array.isArray(section.content)) {
          section.content.forEach((line) => {
            if (line.startsWith("*") || line.startsWith("-")) {
              content += `${line}\n`; 
            } else if (line.includes("`")) {
              content += `\n\`\`\`\n${line.replace(/`/g, "")}\n\`\`\`\n`; 
            } else {
              content += `${line}\n\n`; 
            }
          });
        }

       
        if (Array.isArray(section.notes) && section.notes.length > 0) {
          section.notes.forEach((note) => {
            content += `- ${note}\n`;
          });
          content += `\n`;
        }
      });
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
  const router = useRouter();

  const fetchNotes = useCallback(async () => {
    try {
      const { data } = await axios.post("/api/study-type", {
        courseId,
        studyType: "notes",
      });

      console.log("Raw API Response:", data);

      const sortedNotes = data
        .map((item) => ({
          chapterId: item.chapterId,
          content: parseNotes(item.notes),
        }))
        .sort((a, b) => a.chapterId - b.chapterId);

      console.log("Processed Notes:", sortedNotes);
      setNotes(sortedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }, [courseId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (stepCount < notes.length - 1) {
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
      {notes.length > 0 ? (
        <div className="mt-10">
          <div className="prose prose-xs md:prose-sm lg:prose-lg max-w-none">
            <ReactMarkdown>{notes[stepCount]?.content}</ReactMarkdown>
          </div>

          <div className="flex gap-5 items-center mb-5 mt-5">
            {stepCount > 0 && (
              <Button variant="outline" size="sm" onClick={handlePrevious}>
                Previous
              </Button>
            )}

            {notes.map((_, index) => (
              <div
                key={index}
                className={`w-full h-2 rounded-full ${
                  index < stepCount ? "bg-cyan-600" : "bg-gray-200"
                }`}
              ></div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={stepCount >= notes.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-10 flex-col justify-center">
          <h2 className="text-5xl mt-20 font-semibold">End of Notes</h2>
          <Button className="mb-10" onClick={() => router.back()}>
            Go to Course Page
          </Button>
        </div>
      )}
    </div>
  );
}

export default ViewNotes;
