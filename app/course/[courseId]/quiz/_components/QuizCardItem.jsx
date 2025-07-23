import React, { useState } from 'react'

function QuizCardItem({quiz,userSelectedOption}) {
  const [selectedOption,setSelectedOption]=useState();

  return quiz &&(
    <div className='mt-10 p-10'>
      <h2 className='font-medium text-xl text-center'>Q) {quiz?.question}</h2>
      <div className='grid grid-cols-2 gap-5 mt-6'>
        {quiz?.options.map((option,index)=>(
          <h2 
          onClick={()=>{setSelectedOption(option);
          userSelectedOption(option)
          }}
          key={index} variant='outline' className={`w-full border border-gray-400 rounded-xl p-3 px-4 text-center text-md hover:bg-cyan-600 cursor-pointer items-center justify-center
          ${selectedOption==option && 'bg-cyan-600 text-white hover:bg-cyan-800'}
          `}>{option}</h2>
        ))}
      </div>
     </div>
  )
}

export default QuizCardItem
