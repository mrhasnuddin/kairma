import React, { Suspense } from "react";
import SiteShellV4 from "@/components/v4/SiteShellV4";

// v4 (Heron grammar). The v3 bento shell stays in components/layout until v4 is signed off.
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-k-paper" />}>
      <SiteShellV4 />
    </Suspense>
  );
}
