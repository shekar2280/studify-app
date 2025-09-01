"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Lottie from "lottie-react";
import animationData from "../animations/loading.json";
import { Merriweather } from "next/font/google";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function LoadingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const [progress, setProgress] = useState(0);
  const [chapters, setChapters] = useState([]);
  const [status, setStatus] = useState("Generating");

  useEffect(() => {
    if (!courseId) return;

    const pollCourseStatus = async () => {
      const pollInterval = 3000;
      const maxAttempts = 60;
      let attempts = 0;

      const poll = setInterval(async () => {
        attempts++;
        try {
          const res = await axios.get("/api/course-status", {
            params: { courseId },
          });

          const data = res.data;

          setStatus(data.status);
          setChapters(data.chapters || []);

          if (data.chapters && data.chapters.length > 0) {
            const readyCount = data.chapters.filter(
              (ch) => ch.status === "Ready"
            ).length;
            const total = data.chapters.length;
            setProgress(Math.round((readyCount / total) * 100));
          }

          if (data.status === "Ready") {
            clearInterval(poll);
            toast.success("Study material is ready!");
            router.replace("/dashboard");
          } else if (data.status === "failed" || attempts >= maxAttempts) {
            clearInterval(poll);
            toast.error("Failed to generate study material.");
            router.replace("/dashboard");
          }
        } catch (error) {
          clearInterval(poll);
          toast.error("Error checking course status.");
          router.replace("/create");
        }
      }, pollInterval);
    };

    pollCourseStatus();
  }, [courseId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <div>
        <Lottie
          animationData={animationData}
          className="w-48 h-48 sm:w-72 sm:h-72 md:w-[350px] md:h-[350px]"
          loop
          autoPlay
        />
        <p
          className={`mt-4 text-lg sm:text-xl font-medium ${merriweather.className}`}
        >
          Generating your study material...
        </p>
        <p
          className={`text-xs sm:text-sm text-gray-500 mt-1 ${merriweather.className}`}
        >
          Hang tight! This may take a few seconds.
        </p>
      </div>

      <div className="w-full max-w-md mt-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm mt-2 text-gray-600">{progress}% completed</p>
      </div>

      <div className="w-full max-w-md mt-6 text-left">
        {chapters.map((ch, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center border-b py-2 text-sm"
          >
            <span>Chapter {idx + 1}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                ch.status === "Ready"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {ch.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
