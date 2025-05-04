"use client";

import AmbulanceTracker from "@/app/components/home/AmbulanceTracker";
import { Suspense } from "react";

export default function TrackPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Loading tracker...</div>}>
        <AmbulanceTracker ambulanceId="6816cfc75b316de1adb11849" />
      </Suspense>
    </div>
  );
}
