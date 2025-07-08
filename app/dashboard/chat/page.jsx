// app/coming-soon/page.tsx or src/pages/coming-soon.jsx
import React from "react";

export default function Chat() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-cyan-600 to-black text-white">
      <div className="text-center space-y-6 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold tracking-wide">🚧 Coming Soon</h1>
        <p className="text-lg md:text-2xl text-gray-300">
          We're building something amazing for you. Stay tuned!
        </p>
        <div className="flex justify-center mt-6">
          <div className="w-4 h-4 bg-cyan-500 rounded-full animate-ping"></div>
          <div className="w-4 h-4 bg-cyan-400 rounded-full mx-2 animate-pulse"></div>
          <div className="w-4 h-4 bg-cyan-300 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
