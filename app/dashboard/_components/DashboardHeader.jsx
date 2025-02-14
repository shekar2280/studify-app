import { UserButton } from "@clerk/nextjs";
import { Bell, Search } from "lucide-react";
import Link from "next/link";
import React from "react";

function DashboardHeader() {
  return (
    <div className="p-5 shadow-md flex justify-between items-center">
      <Link href={"/dashboard"}>
        <h2 className="font-bold text-2xl pl-5">Dashboard</h2>
      </Link>
      <div className="flex items-center gap-4">
        <UserButton afterSignOutUrl="http://localhost:3000" />
      </div>
    </div>
  );
}

export default DashboardHeader;
