import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaBook, FaTrashAlt } from "react-icons/fa";

function CourseCardItem({ course, onDelete }) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const localDate = new Date(course.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setFormattedDate(localDate);
  }, [course.createdAt]);

  const handleDelete = () => {
    onDelete(course.courseId);
  };

  return (
    <div className="border rounded-lg shadow-md p-5 h-[250px] flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-[15px] font-medium">
            Course Type: {course?.courseType}
          </h2>
          <h2 className="text-[10px] p-1 px-2 rounded-full bg-cyan-600 text-white">
            {formattedDate || "Loading..."}
          </h2>
        </div>
        <h2 className="mt-3 font-medium line-clamp-1 text-lg">
          {course?.courseLayout?.course_name}
        </h2>
        <p className="text-sm line-clamp-2 text-gray-500 mt-2">
          {course?.courseLayout?.course_summary}
        </p>

        <div className="mt-3">
          <Progress value={0} />
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
}

export default CourseCardItem;
