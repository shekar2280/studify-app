"use client";
import { useUser } from "@clerk/nextjs";
import Lottie from "lottie-react";
import animationData from "../../animations/dashboard.json";
import React from "react";

function WelcomeBanner() {
  const { user } = useUser();

  return (
    <div className="relative p-5 rounded-lg overflow-hidden text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/welcome-banner.webp')` }}
      />

      <div className="absolute inset-0 bg-black bg-opacity-60" />

      <div className="relative z-10 flex items-center gap-6">
        <div className="w-[160px] h-[160px]">
          <Lottie animationData={animationData} loop autoplay />
        </div>
        <div>
          <h2 className="font-bold text-3xl">👋 Hello, {user?.fullName}</h2>
          <p>Welcome Back, Start learning new lesson's 🚀</p>
        </div>
      </div>

      
    </div>
  );
}

export default WelcomeBanner;
