"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function safeParseNotes(notesString) {
  if (typeof notesString !== "string") return notesString;

  try {
    const sanitizedString = notesString
      .replace(/\\(?!["\\/bfnrtu])/g, "") 
      .replace(/[\u0000-\u001F]+/g, ""); 

    const parsed = JSON.parse(sanitizedString);

    if (typeof parsed === "object" && parsed !== null) {
      return parsed.chapter_content || parsed.content || "";
    }

    return parsed;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return notesString; 
  }
}

function getChapterContent(content) {
  if (!content) return "<p>No content available</p>";
  return typeof content === "string" ? content.replace(/\\n/g, "<br>") : "<p>No content available</p>";
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
                __html: getChapterContent(notes[stepCount]?.content),
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
        <div className="flex gap-5 items-center mb-5">
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
