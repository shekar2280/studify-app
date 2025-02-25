"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function formatMarkdownToHTML(text) {
  if (!text) return "";
  if (Array.isArray(text)) text = text.join("\n");

  return String(text) // Ensure text is a string
    .replace(/\*\*\*(.*?)\*\*\*/g, "<b><i>$1</i></b>") // Bold & Italic
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Bold
    .replace(/\*(.*?)\*/g, "<i>$1</i>") // Italic
    .replace(/\n\*/g, "<br>•") // Convert * into bullet points with line breaks
    .replace(/^\*/gm, "•") // Replace * at start of lines with bullet points
    .replace(/\n/g, "<br>"); // Preserve line breaks properly
}

function safeParseNotes(notesString) {
  if (typeof notesString !== "string") return notesString;

  try {
    const parsed = JSON.parse(notesString);
    let contentHTML = "";

    if (parsed.chapter_name) {
      contentHTML += `<h2>${parsed.emoji || ""} ${parsed.chapter_name}</h2>`;
    }

    if (parsed.chapter_summary) {
      contentHTML += `<p>${formatMarkdownToHTML(parsed.chapter_summary)}</p>`;
    }

    // Handle "subtopics" format
    if (Array.isArray(parsed.subtopics)) {
      parsed.subtopics.forEach((subtopic) => {
        contentHTML += `<h3>${subtopic.title}</h3>`;

        if (Array.isArray(subtopic.content)) {
          subtopic.content.forEach((item) => {
            if (typeof item === "string") {
              contentHTML += `<p>${formatMarkdownToHTML(item)}</p>`;
            } else if (typeof item === "object" && item.V) {
              // Handle the 5 V’s special format
              contentHTML += `<h4>${item.V}</h4>`;
              contentHTML += `<p>${formatMarkdownToHTML(item.description)}</p>`;

              if (Array.isArray(item.examples)) {
                contentHTML += "<ul>";
                item.examples.forEach((example) => {
                  contentHTML += `<li>${formatMarkdownToHTML(example)}</li>`;
                });
                contentHTML += "</ul>";
              }
            }
          });
        }
      });
    }

    // Handle "notes" format
    if (Array.isArray(parsed.notes)) {
      parsed.notes.forEach((note) => {
        contentHTML += `<h3>${note.subtopic}</h3>`;
        contentHTML += `<p>${formatMarkdownToHTML(note.content.join("\n"))}</p>`;
      });
    }

    return contentHTML || "<p>No content available</p>";
  } catch (error) {
    console.error("🚨 Error parsing JSON:", error);
    return "<p>Invalid content format</p>";
  }
}



function ViewNotes() {
  const { courseId } = useParams();
  const [notes, setNotes] = useState([]);
  const [stepCount, setStepCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    GetNotes();
  }, []);

  const GetNotes = async () => {
    try {
      const result = await axios.post("/api/study-type", {
        courseId,
        studyType: "notes",
      });

      console.log("Raw API Response:", result?.data);

      const sortedNotes = result?.data
        .map((item) => ({
          chapterId: item.chapterId,
          content: safeParseNotes(item.notes),
        }))
        .sort((a, b) => a.chapterId - b.chapterId);

      console.log("Processed Notes:", sortedNotes);
      setNotes(sortedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (stepCount < notes.length) {
      setStepCount(stepCount + 1);
      scrollToTop();
    }
  };

  const handlePrevious = () => {
    if (stepCount > 0) {
      setStepCount(stepCount - 1);
      scrollToTop();
    }
  };

  return (
    notes.length > 0 && (
      <div>
        <div className="mt-10">
          {stepCount < notes.length ? (
            <div
              className="prose prose-xs md:prose-sm lg:prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: notes[stepCount]?.content,
              }}
            />
          ) : (
            <div className="flex items-center gap-10 flex-col justify-center">
              <h2 className="text-5xl mt-20 font-semibold">End of Notes</h2>
              <Button className="mb-10" onClick={() => router.back()}>
                Go to Course Page
              </Button>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-5 items-center mb-5 mt-5">
          {stepCount !== 0 && (
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
            disabled={stepCount >= notes.length}
          >
            Next
          </Button>
        </div>
      </div>
    )
  );
}

export default ViewNotes;