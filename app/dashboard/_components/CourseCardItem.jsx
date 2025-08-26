"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { poppins } from "@/app/fonts";

const CourseCardItem = ({ course, onDelete }) => {
  const { user } = useUser();
  const [formattedDate, setFormattedDate] = useState("");
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const localDate = new Date(course.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setFormattedDate(localDate);
  }, [course.createdAt]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get(
          `/api/progress?courseId=${course.courseId}&userId=${user.id}`
        );
        setProgress(res.data);
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    };

    fetchProgress();
  }, [user?.id, course.courseId]);

  const completedTasks = [
    progress?.notesCompleted,
    progress?.flashcardsCompleted,
    progress?.quizCompleted,
    progress?.qaCompleted,
  ].filter(Boolean).length;

  const totalTasks = 4;
  const progressValue = (completedTasks / totalTasks) * 100;

  const handleDelete = () => {
    onDelete(course.courseId);
  };

  return (
    <div className="relative border rounded-lg shadow-md h-[230px] sm:h-[250px] md:h-[280px] flex flex-col justify-between overflow-hidden">
      <Image
        src="/course-card.jpg" 
        alt="Course Background"
        fill
        priority
        sizes="100vw"
        className="object-cover absolute inset-0"
      />

      <div className="relative p-5 text-white">
        <div className="flex justify-between items-center">
          <h2
            className={`text-[11px] sm:text-[12px] md:text-[14px] font-normal ${poppins.className} text-black`}
          >
            Course Type:{" "}
            <span className="text-red-500">{course?.courseType}</span>
          </h2>
          <h2 className="text-[8px] sm:text-[10px] md:text-[12px] p-1 px-2 rounded-full bg-cyan-600 text-white">
            {formattedDate || "Loading..."}
          </h2>
        </div>

        <h2
          className={`mt-3 font-semibold line-clamp-1 text-[16px] sm:text-[16px] md:text-[18px] ${poppins.className} text-black`}
        >
          {course?.courseLayout?.course_name}
        </h2>
        <p className="text-[10px] sm:text-[12px] md:text-[14px] line-clamp-2 sm:line-clamp-3 md:line-clamp-4 text-white mt-2">
          {course?.courseLayout?.course_summary}
        </p>

        <div className="mt-3">
          <Progress value={progressValue} />
          <p className="text-sm text-muted-foreground mt-1 text-white">
            {Math.round(progressValue)}% completed
          </p>
        </div>

        <div className="mt-2 flex justify-between items-center gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm md:px-4 md:py-2 md:text-base"
          >
            <FaTrashAlt className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </Button>

          <Link href={`/course/${course?.courseId}`}>
            <Button className="px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm md:px-4 md:py-2 md:text-base">
              View
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCardItem;
