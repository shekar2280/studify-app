"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const LoadingClient = dynamic(() => import("./LoadingClient"), {
  ssr: false,
});

export default function LoadingWrapper() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <LoadingClient />
    </Suspense>
  );
}
