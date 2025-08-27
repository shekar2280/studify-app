"use client";
import React, { useState, useEffect } from "react";
import SideBar from "./_components/SideBar";
import DashboardHeader from "./_components/DashboardHeader";
import { usePathname } from "next/navigation";
import WelcomeBanner from "./_components/WelcomeBanner";

function DashboardLayout({ children }) {
  const path = usePathname();
  const collapsedRoutes = ["/dashboard/chat"];
  const isCollapsed = collapsedRoutes.includes(path);

  const noPaddingRoutes = ["/dashboard"];
  const shouldRemovePadding = noPaddingRoutes.includes(path);

  // Persist streak state here
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    if (streak === null) {
      fetch("/api/user")
        .then(res => res.json())
        .then(data => setStreak(data.streak))
        .catch(err => console.error(err));
    }
  }, [streak]);

  return (
    <div className="flex min-h-screen w-full bg-cover bg-center bg-gray-100">
      <div className="w-full">
        {path !== "/dashboard/chat" && <DashboardHeader />}

        <div className={shouldRemovePadding ? "p-10" : "p-0"}>
          {/* Pass streak to WelcomeBanner only on dashboard */}
          {path === "/dashboard" && <WelcomeBanner streak={streak} />}
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
