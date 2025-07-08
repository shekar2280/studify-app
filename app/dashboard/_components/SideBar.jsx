"use client";

import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  UserCircle,
  VideoIcon,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function SideBar({ collapsed }) {
  const MenuList = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Chat", icon: MessageCircle, path: "/dashboard/chat" },
    { name: "Profile", icon: UserCircle, path: "/dashboard/profile" },
  ];

  const path = usePathname();

  return (
    <div className="h-screen shadow-md p-5 flex flex-col items-center">
      <div className="flex gap-2 items-center justify-center">
        <Image src={"/icons8-logo.svg"} alt="logo" width={40} height={40} />
        {!collapsed && (
          <h2 className="font-bold text-2xl text-cyan-700">Studify</h2>
        )}
      </div>

      {!collapsed && (
        <Link href={"/create"} className="w-full mt-10">
          <Button className="w-full">
            <span className="mr-1 text-2xl">+</span>Create New Course
          </Button>
        </Link>
      )}

      <div className={`mt-10 w-full ${collapsed ? "flex flex-col items-center" : ""}`}>
        {MenuList.map((menu, index) => (
          <Link href={menu.path} key={index}>
            <div
              className={`flex items-center gap-5 p-3 rounded-lg mt-3 
                hover:bg-slate-200 cursor-pointer
                ${path === menu.path ? "bg-slate-200" : ""} 
                ${collapsed ? "justify-center" : ""}`}
            >
              <menu.icon />
              {!collapsed && <h1>{menu.name}</h1>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SideBar;
