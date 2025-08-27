import React, { useState } from "react";

function QuizCardItem({ quiz, correctAnswer }) {
  const [selectedOption, setSelectedOption] = useState();

  return (
    quiz && (
      <div className="mt-3 sm:mt-5 p-3 sm:p-5">
        <h2 className="font-medium text-base sm:text-lg lg:text-xl text-center">
          Q) {quiz?.question}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 mt-4 sm:mt-6">
          {quiz?.options.map((option, index) => {
            let optionClass =
              "border border-gray-400 rounded-xl p-3 px-4 text-center text-sm sm:text-base lg:text-xl cursor-pointer ";

            if (selectedOption) {
              if (option === selectedOption && option === correctAnswer) {
                optionClass += "bg-green-600 text-white"; 
              } else if (
                option === selectedOption &&
                option !== correctAnswer
              ) {
                optionClass += "bg-red-600 text-white"; 
              } else if (option === correctAnswer) {
                optionClass += "bg-green-600 text-white"; 
              }
            } else {
              optionClass += "hover:bg-cyan-600"; 
            }

            return (
              <h2
                key={index}
                onClick={() => {
                  if (!selectedOption) {
                    setSelectedOption(option); 
                  }
                }}
                className={optionClass}
              >
                {option}
              </h2>
            );
          })}
        </div>
      </div>
    )
  );
}

export default QuizCardItem;
