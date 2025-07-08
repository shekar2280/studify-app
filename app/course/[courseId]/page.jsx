"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import CourseIntroCard from "./_components/CourseIntroCard";
import StudyMaterialSection from "./_components/StudyMaterialSection";
import ChapterList from "./_components/ChapterList";

const fetchCourse = async (courseId) => {
  const result = await axios.get("/api/courses?courseId=" + courseId);
  return result.data.result;
};

function Course() {
  const { courseId } = useParams();

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", courseId], 
    queryFn: () => fetchCourse(courseId),
    staleTime: 1000 * 60 * 5, 
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center mt-60">
        <div className="relative w-10 h-10 border-4 border-cyan-600 border-solid animate-spin rounded-full">
          <div className="absolute inset-0 bg-white w-1/2 h-1/2 animate-pulse"></div>
        </div>
      </div>
    );

  return (
    <div className="mb-10">
      <CourseIntroCard course={course} />
      <StudyMaterialSection courseId={courseId} course={course} />
      <ChapterList course={course} />
    </div>
  );
}

export default Course;
