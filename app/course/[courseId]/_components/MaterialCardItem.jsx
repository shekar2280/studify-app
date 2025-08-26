"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function MaterialCardItem({ item, studyTypeContent, course, refreshData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isReadyFromParent = studyTypeContent?.[item.type]?.some(
    (content) => content.status === "Ready"
  );

  useEffect(() => {
    if (!isReadyFromParent && loading) {
      const interval = setInterval(() => {
        refreshData(); 
      }, 5000); 

      return () => clearInterval(interval);
    }
  }, [isReadyFromParent, refreshData, loading]);

  const GenerateContent = async () => {
    toast("Generating your content...");
    setLoading(true); 

    let chapters = course?.courseLayout.chapters
      .map((chapter) => chapter.chapter_name || chapter.chapterName)
      .join(", ");


    try {
      await axios.post("/api/study-type-content", {
        courseId: course?.courseId,
        type: item.name,
        chapters: chapters,
      });

      toast("Content is being generated...");
      
    } catch (error) {
      console.error("Error generating content:", error);
      toast("An error occurred while generating content.");
      setLoading(false); 
    }
  };

  const cardContent = (
    <div
      className={`border shadow-md rounded-lg p-5 flex flex-col items-center ${
        !isReadyFromParent && "grayscale"
      }`}
    >
      <h2
        className={`p-1 px-2 text-white rounded-full text-[10px] mb-2 ${
          isReadyFromParent ? "bg-green-500" : "bg-gray-500"
        }`}
      >
        {isReadyFromParent ? "Ready" : "Generate"}
      </h2>

      <Image src={item.icon} alt={item.name} width={50} height={50} />
      <h2 className="text-[14px] sm:text-sm md:text-base font-medium mt-3">{item.name}</h2>

      {!isReadyFromParent ? (
        <Button className="mt-3 w-full text-sm" variant="outline" onClick={GenerateContent} disabled={loading}>
          {loading ? <RefreshCcw className="animate-spin" /> : "Generate"}
        </Button>
      ) : (
        <Button className="mt-3 w-full text-sm" variant="outline">
          View
        </Button>
      )}
    </div>
  );

  return isReadyFromParent ? (
    <Link href={`/course/${course?.courseId}${item.path}`}>{cardContent}</Link>
  ) : (
    cardContent
  );
}

export default MaterialCardItem;
