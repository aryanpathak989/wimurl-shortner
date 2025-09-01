"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingScreen from "@/components/ui/Loader";

function AuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");
    const profile = searchParams.get("profile");

    if (firstName && lastName) {
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);
      localStorage.setItem("profile", profile!);
      localStorage.setItem("isAuthenicated", "true");
    }

    router.replace("/dashboard");
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingScreen />
    </div>
  );
}

export default function AuthSuccessWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuthSuccess />
    </Suspense>
  );
}
