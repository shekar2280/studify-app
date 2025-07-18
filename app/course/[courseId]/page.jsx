"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import CourseIntroCard from "./_components/CourseIntroCard";
import StudyMaterialSection from "./_components/StudyMaterialSection";
import ChapterList from "./_components/ChapterList";
import { useUser } from "@clerk/nextjs";

const fetchCourse = async (courseId, userId) => {
  const courseRes = await axios.get("/api/courses?courseId=" + courseId);
  console.log("Course Res: ", courseRes);
  const progressRes = await axios.get(
    `/api/progress?courseId=${courseId}&userId=${userId}`
  );
  console.log("Progress: ", progressRes);

  return {
    ...courseRes.data.result,
    progress: progressRes.data,
  };
};

function Course() {
  const { user } = useUser();
  const { courseId } = useParams();

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", courseId, user?.id],
    queryFn: () => fetchCourse(courseId, user?.id),
    enabled: !!user?.id,
  });

  if (isLoading || !course)
  return (
    <div className="flex justify-center items-center mt-60">
      <div className="flex h-[300px]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600" />
      </div>
    </div>
  );


  return (
    <div className="mb-10">
      <CourseIntroCard course={course} progress={course.progress} />
      <StudyMaterialSection courseId={courseId} course={course} />
      <ChapterList course={course} />
    </div>
  );
}

export default Course;
