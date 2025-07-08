import { UserButton } from "@clerk/nextjs";
import { Bell, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Header() {
  return (
    <div className="p-5 shadow-md flex justify-between items-center">
      <Link href={"/dashboard"}>
        <Image src={"/icons8-logo.svg"} alt="logo" width={40} height={40} />
      </Link>
      <div className="flex items-center gap-4">
        <UserButton afterSignOutUrl="http://localhost:3000" />
      </div>
    </div>
  );
}

export default Header;
