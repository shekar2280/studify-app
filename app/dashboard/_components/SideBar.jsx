"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LayoutDashboard, UserCircle, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function SideBar() {
  const MenuList = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Video Chat",
      icon: VideoIcon,
      path: "/dashboard/video-chat",
    },
    {
      name: "Profile",
      icon: UserCircle,
      path: "/dashboard/profile",
    },
  ];

  const path = usePathname();

  return (
    <div className="h-screen shadow-md p-5">
      <div className="flex gap-2 items-center">
        <Image src={"/icons8-logo.svg"} alt="logo" width={40} height={40} />
       {/* <a target="_blank" href="https://icons8.com/icon/7EZ6mRn825lD/jira">Logo</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> */}
        <h2 className="font-bold text-2xl text-cyan-700">Studify</h2>
      </div>
      <div className="mt-14">
        <Link href={'/create'} className="w-full">
          <Button className="w-full"><span className="mr-1 text-2xl">+</span>Create New Course</Button>
        </Link>

        <div className="mt-10">
          {MenuList.map((menu, index) => (
            <div
              key={index}
              className={`flex gap-5 items-center p-3 
          hover:bg-slate-200 rounded-lg cursor-pointer mt-3
          ${path == menu.path && "bg-slate-200"} `}
            >
              <menu.icon />
              <h1>{menu.name}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SideBar;
