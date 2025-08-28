"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { FaFire } from "react-icons/fa6";
import Image from "next/image";

function WelcomeBanner({ streak }) {
  const { user } = useUser();
  
  if (streak === null) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600" />
      </div>
    );
  }

  return (
    <div className="relative p-4 sm:p-5 rounded-lg overflow-hidden bg-gradient-to-r from-cyan-500 to-black text-white h-30 sm:h-48 md:h-56">
      {/* <Image
        src="/banner.jpg"
        alt="Welcome Banner"
        fill
        priority
        className="object-cover"
      /> */}

      <div className="absolute inset-0 bg-black bg-opacity-60" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 h-full">
        <div className="flex flex-col text-center sm:text-left gap-2 sm:gap-3">
          <h2 className="font-bold text-xl sm:text-2xl md:text-4xl truncate max-w-[250px] sm:max-w-[500px] md:max-w-[700px]">
            👋 Hello, {user?.fullName}
          </h2>

          <p className="hidden sm:block text-sm md:text-xl pl-4">
            Welcome Back, Start learning new lessons 🚀
          </p>
        </div>

        <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-lg sm:rounded-xl">
          <FaFire className="text-orange-400" size={40} />
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-2xl sm:text-4xl md:text-5xl font-bold">
              {streak} {streak === 1 ? "day" : "days"}
            </span>
            <span className="text-xs sm:text-base md:text-lg text-orange-500">
              Current streak
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeBanner;
