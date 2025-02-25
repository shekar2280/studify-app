"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseCardItem from "./CourseCardItem";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search } from "lucide-react";

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

  const startPolling = (courses) => {
    const processingCourses = courses.filter(course => course.status === "processing");
    if (processingCourses.length === 0) return;

    const interval = setInterval(async () => {
      const updatedCourses = await Promise.all(
        processingCourses.map(async (course) => {
          try {
            const res = await axios.get(`/api/get-course-outline?recordId=${course.id}`);
            return res.data.status === "completed" ? res.data : course;
          } catch (error) {
            console.error("Error fetching course status:", error);
            return course;
          }
        })
      );

      setCourseList((prevCourses) =>
        prevCourses.map((course) =>
          updatedCourses.find((c) => c.id === course.id) || course
        )
      );

      if (!updatedCourses.some((c) => c.status === "processing")) {
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
    <div className="mt-10">
      <h2 className="font-bold text-2xl flex justify-between items-center">
        Your Study Material
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-2 border rounded-md shadow-md">
            <input
              type="text"
              placeholder="Search..."
              className="outline-none w-60 pl-2 text-xl text-gray-700"
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
        {!loading
          ? filteredCourses.map((course, index) => (
              <CourseCardItem course={course} key={index} />
            ))
          : [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div
                key={index}
                className="h-56 w-full bg-slate-200 rounded-lg animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default CourseList;
