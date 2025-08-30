"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";

function SelectOption({ selectedStudyType }) {
  const Options = [
    {
      name: "Exam",
      icon: "/exam.png",
    },
    {
      name: "Job Interview",
      icon: "/job.png",
    },
    {
      name: "Practice",
      icon: "/practice.png",
    },
    {
      name: "Coding Prep",
      icon: "/code.png",
    },
    {
      name: "Other",
      icon: "/knowledge.png",
    },
  ];
  const [selectedOption, setSelectedOption] = useState();
  return (
    <div>
      <h2 className="text-center mb-2 text-lg">
        Choose the topic you want to create the material for ?
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 mt-5">
        {Options.map((option, index) => (
          <div
            key={index}
            className={`p-3 sm:p-4 flex flex-col items-center justify-center border rounded-xl hover:border-primary cursor-pointer ${
              option?.name == selectedOption && "border-primary"
            }`}
            onClick={() => {
              setSelectedOption(option.name);
              selectedStudyType(option.name);
            }}
          >
            <Image
              src={option.icon}
              alt={option.name}
              width={50}
              height={50}
              className="sm:w-[60px] sm:h-[60px]"
            />
            <h2 className="text-xs sm:text-sm mt-2">{option.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectOption;
