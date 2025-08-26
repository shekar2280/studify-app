import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import React from "react";

function CourseIntroCard({ course, progress }) {
  const completedTasks = [
    progress?.notesCompleted,
    progress?.flashcardsCompleted,
    progress?.quizCompleted,
    progress?.qaCompleted,
  ].filter(Boolean).length;

  const totalTasks = 4;
  const progressValue = (completedTasks / totalTasks) * 100;

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center p-4 sm:p-6 border shadow-md rounded-lg">
      <Image
        src={"/exam.png"}
        alt="other"
        height={70}
        width={70}
        className="flex-shrink-0 mx-auto sm:mx-0"
      />

      <div className="flex-1 text-center sm:text-left">
        <h2 className="font-bold text-lg sm:text-2xl line-clamp-2">
          {course?.courseLayout?.course_name}
        </h2>
        
        <p className="text-[14px] sm:text-sm md:text-base text-muted-foreground mt-1">
          {course?.courseLayout?.course_summary}
        </p>

        <Progress className="mt-3" value={progressValue} />
        <p className="text-[14px] sm:text-sm text-muted-foreground mt-1">
          {progressValue.toFixed(0)}% completed
        </p>

        <h2 className="mt-2 text-[16px] sm:text-lg text-primary font-semibold">
          Total Chapters: {course?.courseLayout?.chapters?.length}
        </h2>
      </div>
    </div>
  );
}

export default CourseIntroCard;
