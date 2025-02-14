"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function MaterialCardItem({ item, studyTypeContent, course, refreshData }) {
  const router = useRouter();
  const isReadyFromParent = studyTypeContent?.[item.type]?.length > 0;

  const [contentReady, setContentReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const isReady = isReadyFromParent || contentReady;

  const GenerateContent = async () => {
    toast("Generating your content...");
    setLoading(true);

    let chapters = "";
    course?.courseLayout.chapters.forEach((chapter) => {
      chapters = (chapter.chapter_name || chapter.chapterName) + "," + chapters;
    });
    console.log(chapters);

    try {
      const result = await axios.post("/api/study-type-content", {
        courseId: course?.courseId,
        type: item.name,
        chapters: chapters,
      });
      console.log("Generated result:", result);

      refreshData(true);

      setContentReady(true);

      toast("Your content is ready to view");

      setTimeout(() => {
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error("Error generating content:", error);
      toast("An error occurred while generating content.");
    } finally {
      setLoading(false);
    }
  };

  const cardContent = (
    <div
      className={`border shadow-md rounded-lg p-5 flex flex-col items-center ${
        !isReady && "grayscale"
      }`}
    >
      {!isReady ? (
        <h2 className="p-1 px-2 bg-gray-500 text-white rounded-full text-[10px] mb-2">
          Generate
        </h2>
      ) : (
        <h2 className="p-1 px-2 bg-green-500 text-white rounded-full text-[10px] mb-2">
          Ready
        </h2>
      )}

      <Image src={item.icon} alt={item.name} width={50} height={50} />
      <h2 className="font-medium mt-3">{item.name}</h2>

      {!isReady ? (
        <Button
          className="mt-3 w-full"
          variant="outline"
          onClick={GenerateContent}
        >
          {loading ? <RefreshCcw className="animate-spin" /> : "Generate"}
        </Button>
      ) : (
        <Button className="mt-3 w-full" variant="outline">
          View
        </Button>
      )}
    </div>
  );

  return isReady ? (
    <Link href={`/course/${course?.courseId}${item.path}`}>{cardContent}</Link>
  ) : (
    cardContent
  );
}

export default MaterialCardItem;
