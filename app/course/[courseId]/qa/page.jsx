"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import QACardItem from "./_components/QACardItem";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";

function QA() {
  const { courseId } = useParams();
  const [qaData, setQaData] = useState([]);
  const [currentTopic, setCurrentTopic] = useState(0);
  const route = useRouter();
  const { user } = useUser();

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
  };

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

  const handleComplete = async () => {
    try {
      await axios.post("/api/progress", {
        userId: user?.id,
        courseId,
        type: "qa",
        value: true,
      });
    } catch (error) {
      console.error("Failed to update progress:", error);
    } finally {
      route.back();
    }
  };

  return (
    <div className="mt-10 mb-20">
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

          <div>
            {currentTopic > 0 && (
              <Button
                variant="outline"
                className="hidden md:flex fixed top-1/2 left-4 -translate-y-1/2 ml-6"
                onClick={goToPreviousTopic}
              >
                <FaArrowLeftLong />
              </Button>
            )}
            {currentTopic + 1 < qaData.length ? (
              <Button
                variant="outline"
                className="hidden md:flex fixed top-1/2 right-4 -translate-y-1/2 mr-6"
                onClick={goToNextTopic}
              >
                <FaArrowRightLong />
              </Button>
            ) : (
              <Button
                variant="outline"
                className="hidden md:flex fixed top-1/2 right-4 -translate-y-1/2 mr-6"
                onClick={handleComplete}
              >
                Go to Course
              </Button>
            )}

            <div className="flex md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-3 justify-between">
              {currentTopic > 0 && (
                <Button
                  variant="outline"
                  onClick={goToPreviousTopic}
                  className="flex-1 mr-2"
                >
                  <FaArrowLeftLong className="mr-1" /> Prev
                </Button>
              )}
              {currentTopic + 1 < qaData.length ? (
                <Button
                  variant="outline"
                  onClick={goToNextTopic}
                  className="flex-1 ml-2"
                >
                  Next <FaArrowRightLong className="ml-1" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleComplete}
                  className="flex-1 ml-2"
                >
                  Go to Course
                </Button>
              )}
            </div>
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
