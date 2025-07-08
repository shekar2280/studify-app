"use client";
import { useUser } from "@clerk/nextjs";
import Lottie from "lottie-react";
import animationData from "../../animations/dashboard.json"; 
import React from "react";

function WelcomeBanner() {
  const { user } = useUser();

  return (
    <div className="p-5 bg-cyan-600 w-full text-white rounded-lg flex items-center gap-6">
      <div className="w-[160px] h-[160px]">
        <Lottie animationData={animationData} loop autoplay />
      </div>
      <div>
        <h2 className="font-bold text-3xl">Hello, {user?.fullName}</h2>
        <p>Welcome Back, Start learning new lesson's</p>
      </div>
    </div>
  );
}

export default WelcomeBanner;
