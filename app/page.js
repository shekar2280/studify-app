"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const features = [
  {
    id: 1,
    title: "Organize Notes",
    img: "/landing-notes.jpg",
    desc: "Keep all your study notes organized in one place.",
  },
  {
    id: 2,
    title: "Track Progress",
    img: "/landing-flashcards.png",
    desc: "Visualize your learning journey and milestones.",
  },
  {
    id: 3,
    title: "Peer Collaboration",
    img: "/landing-quiz.jpg",
    desc: "Work with classmates in real-time.",
  },
  {
    id: 4,
    title: "Personal Dashboard",
    img: "/landing-qa.jpeg",
    desc: "Access all your study tools from a central hub.",
  },
];

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard");
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/video-2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-gray-700 bg-opacity-50"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-white px-4">
        <h1 className="font-sans text-3xl sm:text-4xl md:text-6xl font-bold">
          Welcome to <span className="text-cyan-400">Studify</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl max-w-xl">
          Studify is your AI-powered study companion, offering personalized
          notes, flashcards and more.
        </p>
        <div className="mt-6 w-full sm:w-auto">
          <button
            className="w-[240px] sm:w-[240px] px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-lg font-medium"
            onClick={handleClick}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
