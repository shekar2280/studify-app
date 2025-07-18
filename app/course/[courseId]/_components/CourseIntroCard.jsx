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
    <div className='flex gap-5 items-center p-10 border shadow-md rounded-lg'>
      <Image src={'/exam.png'} alt='other' height={70} width={70} />
      <div>
        <h2 className='font-bold text-2xl'>{course?.courseLayout?.course_name}</h2>
        <p>{course?.courseLayout?.course_summary}</p>

        <Progress className='mt-3' value={progressValue} />
        <p className='text-sm text-muted-foreground mt-1'>
          {progressValue}% completed
        </p>

        <h2 className='mt-3 text-lg text-primary'>
          Total Chapters: {course?.courseLayout?.chapters?.length}
        </h2>
      </div>
    </div>
  );
}


export default CourseIntroCard;
