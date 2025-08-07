"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react"; 
import Header from "../dashboard/_components/Header";
import { Button } from "@/components/ui/button";

function CourseViewLayout({ children }) {
  const router = useRouter();

  const handleBack = () => {
    router.back(); 
  };

  return (
    <div>
      <Header />
      
      <div className="mx-10 md:mx-6 lg:px-50 mt-4">
        <Button
          onClick={handleBack}
          className="flex items-center gap-2 text-md text-white font-medium bg-cyan-600"
        >
          <ArrowLeft className="w-6 h-6" />
          Back
        </Button>
      </div>

      <div className="mx-10 md:mx-36 lg:px-60 mt-6">
        {children}
      </div>
    </div>
  );
}

export default CourseViewLayout;
