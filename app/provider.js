"use client"

import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { eq } from "drizzle-orm";
import React, { useEffect } from "react";

function Provider({ children }) {
  const { user } = useUser();

  useEffect(()=>{
    user && CheckIsNewUser();
  }, [user])

  const CheckIsNewUser = async () => {
    const resp = await axios.post('/api/create-user',{user:user});
  }

  return <div>{children}</div>;
}

export default Provider;
