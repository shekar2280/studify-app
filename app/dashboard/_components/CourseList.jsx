"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseCardItem from "./CourseCardItem";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search } from "lucide-react";
import { poppins } from "@/app/fonts";
import { GiBookshelf } from "react-icons/gi";
import Link from "next/link";

function CourseList() {
  const { user } = useUser();
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      GetCourseList();
    }
  }, [user]);

  const GetCourseList = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/courses", {
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });
      setCourseList(result.data.result);
      startPolling(result.data.result);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (courseId) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/delete-course?courseId=${courseId}`);
      setCourseList((prev) =>
        prev.filter((course) => course.courseId !== courseId)
      );
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("Failed to delete course. Please try again.");
    }
  };

  const startPolling = (courses) => {
    const processingCourses = courses.filter(
      (course) => course.status === "Generating"
    );
    if (processingCourses.length === 0) return;
    const interval = setInterval(async () => {
      const updatedCourses = await Promise.all(
        processingCourses.map(async (course) => {
          try {
            const res = await axios.get(
              `/api/get-course-outline?recordId=${course.id}`
            );
            return res.data.status === "Ready" ? res.data : course;
          } catch (error) {
            console.error("Error fetching course status:", error);
            return course;
          }
        })
      );

      setCourseList((prevCourses) =>
        prevCourses.map(
          (course) => updatedCourses.find((c) => c.id === course.id) || course
        )
      );

      if (!updatedCourses.some((c) => c.status === "Generating")) {
        clearInterval(interval);
      }
    }, 5000);
  };

  const filteredCourses =
    searchQuery.trim() === ""
      ? courseList
      : courseList.filter((course) =>
          course.courseLayout?.course_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
        );

  return (
    <div className="mt-10 bg-gray-100 min-h-[60vh] rounded-lg p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-3 mb-4">
        <h2 className="font-bold text-2xl">Your Study Material</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 border rounded-md shadow-md w-full sm:w-72 bg-white">
            <input
              type="text"
              placeholder="Search..."
              className={`w-full pl-3 py-2 font-medium text-base bg-transparent focus:outline-none text-gray-700 ${poppins.className}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="p-2 bg-cyan-600 hover:bg-cyan-700 rounded-r-md transition">
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex flex-row sm:flex-row gap-3 w-full sm:w-auto">
            <Link href={"/create"} className="w-full sm:w-auto">
              <Button className="h-10 w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700">
                <span className="text-lg font-bold">+</span>
                <span className="hidden sm:inline">Create Course</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={GetCourseList}
              className="h-10 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 mt-5 gap-5">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((item, index) => (
            <div
              key={index}
              className="h-[230px] w-full bg-slate-200 rounded-lg animate-pulse"
            ></div>
          ))
        ) : filteredCourses.length === 0 ? (
          <div className="mt-20 col-span-full text-center text-xl text-gray-600 font-medium">
            <div className="flex flex-col items-center gap-5">
              <GiBookshelf className="text-6xl text-cyan-600" />
              <h2>No courses yet 🎓</h2>
              <h2 className="text-lg text-gray-500">
                Click on{" "}
                <span className="font-semibold">+ Create New Course</span> to
                start learning
              </h2>
            </div>
          </div>
        ) : (
          filteredCourses.map((course, index) => (
            <CourseCardItem
              course={course}
              key={index}
              onDelete={handleDelete}
              chapters={course?.courseLayout?.chapters || []}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default CourseList;
