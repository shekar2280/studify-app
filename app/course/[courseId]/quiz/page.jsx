"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import QuizCardItem from "./_components/QuizCardItem";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

function Quiz() {
  const { courseId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [stepCount, setStepCount] = useState(0);
  const [quiz, setQuiz] = useState([]);
  const [correctAns, setCorrectAns] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRouter();
  const { user } = useUser();

  useEffect(() => {
    GetQuiz();
  }, []);

  const GetQuiz = async () => {
    setLoading(true);
    const result = await axios.post("/api/study-type", {
      courseId: courseId,
      studyType: "Quiz",
    });
    setQuizData(result.data);
    setQuiz(result.data?.content?.questions || []);
    setLoading(false);
  };

  const checkAnswer = (userAnswer, currentQuestion) => {
    setCorrectAns(userAnswer === currentQuestion?.correctAnswer);
  };

  const handleNextStep = () => {
    setCorrectAns(null);
    setStepCount((prev) => prev + 1);
  };

  return (
    <div className="mt-3 sm:mt-10 md:mt-16 lg:mt-20 flex items-center justify-center px-3 sm:px-6">
      <div className="w-full max-w-3xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <p className="mt-4 text-gray-500">Loading Quiz ...</p>
          </div>
        ) : quiz.length > 0 && stepCount < quiz.length ? (
          <>
            <div className="mt-3 md:mt-8 lg:mt-10">
              <QuizCardItem
                quiz={quiz[stepCount]}
                userSelectedOption={(v) => checkAnswer(v, quiz[stepCount])}
              />
            </div>

            <div>
              {correctAns === false && (
                <div className="border p-3 sm:p-4 lg:p-6 border-red-700 bg-red-200 rounded-lg max-w-xl mx-auto mt-4">
                  <h2 className="font-bold text-base sm:text-lg lg:text-xl text-red-600">
                    Incorrect
                  </h2>
                  <p className="text-sm sm:text-base text-red-600">
                    Your answer is incorrect
                  </p>
                </div>
              )}
              {correctAns === true && (
                <div className="border p-3 sm:p-4 lg:p-6 border-green-700 bg-green-200 rounded-lg max-w-xl mx-auto mt-4">
                  <h2 className="font-bold text-base sm:text-lg lg:text-xl text-green-600">
                    Correct
                  </h2>
                  <p className="text-sm sm:text-base text-green-600">
                    Your answer is correct
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-center">
                <Button size="lg" onClick={handleNextStep}>
                  Next Question
                </Button>
              </div>
            </div>
          </>
        ) : (
          !loading && (
            <div className="flex items-center gap-6 sm:gap-8 flex-col justify-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl mt-10 sm:mt-16 font-semibold text-center">
                End of Quiz
              </h2>
              <Button
                size="lg"
                className="mb-10"
                onClick={async () => {
                  try {
                    await axios.post("/api/progress", {
                      userId: user?.id,
                      courseId,
                      type: "quiz",
                      value: true,
                    });
                  } catch (error) {
                    console.error("Failed to update progress:", error);
                  } finally {
                    route.back();
                  }
                }}
              >
                Go to Course Page
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Quiz;
