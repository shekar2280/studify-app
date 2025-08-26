import React, { useState } from 'react'

function QuizCardItem({ quiz, userSelectedOption }) {
  const [selectedOption, setSelectedOption] = useState();

  return (
    quiz && (
      <div className="mt-3 sm:mt-5 p-3 sm:p-5">
        <h2 className="font-medium text-base sm:text-lg lg:text-xl text-center">
          Q) {quiz?.question}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 mt-4 sm:mt-6">
          {quiz?.options.map((option, index) => (
            <h2
              onClick={() => {
                setSelectedOption(option);
                userSelectedOption(option);
              }}
              key={index}
              className={`w-full border border-gray-400 rounded-xl p-3 px-4 text-center 
              text-sm sm:text-base lg:text-xl 
              hover:bg-cyan-600 cursor-pointer
              ${selectedOption == option && "bg-cyan-600 text-white hover:bg-cyan-800"}
              `}
            >
              {option}
            </h2>
          ))}
        </div>
      </div>
    )
  );
}

export default QuizCardItem
