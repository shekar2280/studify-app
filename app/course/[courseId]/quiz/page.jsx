"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import QuizCardItem from "./_components/QuizCardItem";
import { Button } from "@/components/ui/button";

function Quiz() {
  const { courseId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [stepCount, setStepCount] = useState(0);
  const [quiz, setQuiz] = useState([]);
  const [correctAns, setCorrectAns] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRouter();

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
    <div className="mt-30 flex items-center justify-center">
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <p className="mt-4 text-gray-500">Loading Quiz ...</p>
          </div>
        ) : quiz.length > 0 && stepCount < quiz.length ? (
          <>
            <div className="mt-10">
              <QuizCardItem
                quiz={quiz[stepCount]}
                userSelectedOption={(v) => checkAnswer(v, quiz[stepCount])}
              />
            </div>

            <div>
              {correctAns === false && (
                <div className="border p-3 border-red-700 bg-red-200 rounded-lg">
                  <h2 className="font-bold text-lg text-red-600">Incorrect</h2>
                  <p className="text-red-600">Your answer is incorrect</p>
                </div>
              )}
              {correctAns === true && (
                <div className="border p-3 border-green-700 bg-green-200 rounded-lg">
                  <h2 className="font-bold text-lg text-green-600">Correct</h2>
                  <p className="text-green-600">Your answer is correct</p>
                </div>
              )}

              <div className="mt-4 flex justify-center">
                <Button onClick={handleNextStep}>Next Question</Button>
              </div>
            </div>
          </>
        ) : (
          !loading && (
            <div className="flex items-center gap-10 flex-col justify-center">
              <h2 className="text-5xl mt-20 font-semibold">End of Quiz</h2>
              <Button className="mb-10" onClick={() => route.back()}>
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
