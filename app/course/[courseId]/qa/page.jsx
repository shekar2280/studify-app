"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import QACardItem from "./_components/QACardItem";
import { Button } from "@/components/ui/button";

function QA() {
  const { courseId } = useParams();
  const [qaData, setQaData] = useState([]); 
  const [currentTopic, setCurrentTopic] = useState(0);
  const route = useRouter();

  useEffect(() => {
    GetQA();
  }, [courseId]);

  const GetQA = async () => {
    try {
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "Question/Answer",
      });

      const content = result.data?.content || [];
      setQaData(content);
    } catch (error) {
      console.error("Failed to fetch QA data:", error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const goToNextTopic = () => {
    if (currentTopic + 1 < qaData.length) {
      setCurrentTopic((prev) => prev + 1);
      scrollToTop();
    }
  };

  const goToPreviousTopic = () => {
    if (currentTopic > 0) {
      setCurrentTopic((prev) => prev - 1);
      scrollToTop();
    }
  };

  return (
    <div>
      {qaData.length > 0 ? (
        <>
          <h2 className="text-xl font-bold text-center mb-6">
            {qaData[currentTopic]?.topic || "Questions"}
          </h2>

          <div className="space-y-6 mb-5">
            {qaData[currentTopic]?.questions?.map((qa, index) => (
              <QACardItem key={index} qa={qa} />
            ))}
          </div>

          <div className="flex justify-between mt-10 mb-5">
            <Button
              onClick={goToPreviousTopic}
              disabled={currentTopic === 0}
              className="disabled:opacity-50"
            >
              Previous
            </Button>

            {currentTopic + 1 < qaData.length ? (
              <Button onClick={goToNextTopic}>Next </Button>
            ) : (
              <Button onClick={() => route.back()}>Go to Course Page</Button>
            )}
          </div>

          

          
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-96">
            <p className="mt-4 text-gray-500">Loading QA...</p>
          </div>
      )}
    </div>
  );
}

export default QA;
