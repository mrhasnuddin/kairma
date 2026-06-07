import React, { Suspense } from "react";
import SiteShell from "@/components/layout/SiteShell";

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full bg-[#0B0E0B] flex items-center justify-center font-mono text-xs text-[#1FAA68]">
        // CONNECTING TO KAIRMA OS...
      </div>
    }>
      <SiteShell />
    </Suspense>
  );
}
