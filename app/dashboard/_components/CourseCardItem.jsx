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
    <div className="relative border rounded-lg shadow-md p-5 h-[250px] flex flex-col justify-between bg-cover bg-center text-white"
    style={{ backgroundImage: `url('/course-card.jpg')` }}
    >
      <div>
        <div className="flex justify-between items-center">
          <h2 className={`text-[15px] font-normal ${poppins.className} text-black`}>
            Course Type: <span className="text-red-500">{course?.courseType}</span>
          </h2>
          <h2 className="text-[10px] p-1 px-2 rounded-full bg-cyan-600 text-white">
            {formattedDate || "Loading..."}
          </h2>
        </div>
        <h2 className={`mt-3 font-semibold line-clamp-1 text-lg ${poppins.className} text-black `}>
          {course?.courseLayout?.course_name}
        </h2>
        <p className="text-sm line-clamp-2 text-white mt-2">
          {course?.courseLayout?.course_summary}
        </p>

        <div className="mt-3">
          <Progress value={progressValue} />
          <p className="text-sm text-muted-foreground mt-1 text-white">
            {Math.round(progressValue)}% completed
          </p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <Button variant="destructive" onClick={handleDelete}>
            <FaTrashAlt />
          </Button>
          <Link href={`/course/${course?.courseId}`}>
            <Button>View</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCardItem;
