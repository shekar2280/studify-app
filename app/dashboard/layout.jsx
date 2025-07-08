"use client";

import React from "react";
import SideBar from "./_components/SideBar";
import DashboardHeader from "./_components/DashboardHeader";
import { usePathname } from "next/navigation";

function DashboardLayout({ children }) {
  const path = usePathname();
  const collapsedRoutes = ["/dashboard/chat"];
  const isCollapsed = collapsedRoutes.includes(path);

  return (
    <div className="flex">
      <div className={`fixed hidden md:block ${isCollapsed ? "w-20" : "w-64"}`}>
        <SideBar collapsed={isCollapsed} />
      </div>

      <div className={`${isCollapsed ? "md:ml-20" : "md:ml-64"} w-full`}>
        <DashboardHeader />
        <div className="p-10">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
