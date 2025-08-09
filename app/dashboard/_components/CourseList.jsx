"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseCardItem from "./CourseCardItem";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search } from "lucide-react";
import { poppins } from "@/app/fonts";
import { GiBookshelf } from "react-icons/gi";

function CourseList() {
  const { user } = useUser();
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      GetCourseList();
    }
  }, [user]);

  const GetCourseList = async () => {
    setLoading(true);
    const result = await axios.post("/api/courses", {
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });

    setCourseList(result.data.result);
    setLoading(false);

    startPolling(result.data.result);
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
    <div className="mt-10 bg-gray-100 min-h-[60vh] rounded-lg">
      <h2 className="font-bold text-2xl flex justify-between items-center">
        Your Study Material
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-2 border rounded-md shadow-md">
            <input
              type="text"
              placeholder="Search..."
              className={`w-60 pl-2 font-medium text-lg bg-transparent focus:outline-none focus:ring-0 focus:border-transparent  text-gray-700 ${poppins.className}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="p-2 bg-cyan-600 hover:bg-cyan-700 rounded-md transition">
              <Search className="text-xl text-white" />
            </button>
          </div>

          <Button
            variant="outline"
            onClick={GetCourseList}
            className="border-primar text-black h-10"
          >
            <RefreshCw /> Refresh
          </Button>
        </div>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-5 gap-5">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((item, index) => (
            <div
              key={index}
              className="h-56 w-full bg-slate-200 rounded-lg animate-pulse"
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
