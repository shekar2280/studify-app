"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react"; 
import Header from "../dashboard/_components/Header";

function CourseViewLayout({ children }) {
  const router = useRouter();

  const handleBack = () => {
    router.back(); 
  };

  return (
    <div>
      <Header />
      
      <div className="mx-10 md:mx-6 lg:px-50 mt-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-md text-black font-medium"
        >
          <ArrowLeft className="w-6 h-6" />
          Back
        </button>
      </div>

      <div className="mx-10 md:mx-36 lg:px-60 mt-6">
        {children}
      </div>
    </div>
  );
}

export default CourseViewLayout;
