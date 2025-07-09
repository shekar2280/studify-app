"use client";

import { useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Lottie from "lottie-react";
import animationData from "../animations/loading.json";

export default function LoadingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  useEffect(() => {
    if (!courseId) return;

    const pollCourseStatus = async () => {
      const pollInterval = 3000;
      const maxAttempts = 50;
      let attempts = 0;

      const poll = setInterval(async () => {
        attempts++;
        try {
          const res = await axios.get("/api/course-status", {
            params: { courseId },
          });

          if (res.data.status === "Ready") {
            clearInterval(poll);
            toast.success("Study material is ready!");
            router.replace("/dashboard");
          } else if (res.data.status === "failed" || attempts >= maxAttempts) {
            clearInterval(poll);
            toast.error("Failed to generate study material.");
            router.replace("/create");
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
      <Lottie animationData={animationData} className="w-[350px] h-[350px]" loop autoPlay />
      <p className="mt-4 text-xl font-medium">Generating your study material...</p>
      <p className="text-sm text-gray-500">Hang tight! This may take a few seconds.</p>
    </div>
  );
}
