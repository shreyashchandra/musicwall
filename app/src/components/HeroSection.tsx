"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import React, { useEffect } from "react";

function HeroSection() {
  const router = useRouter();
  const session = useSession();
  useEffect(() => {
    if (session.data?.user) {
      router.push("/creator");
    }
  }, [session]);
  return (
    <div className="my-[20%] flex flex-col items-center gap-5">
      <h1 className="text-center text-3xl font-semibold text-white">
        Join Now And Experience The New Way Choosing The Music
      </h1>
      <button
        className="bg-slate-200 text-black px-4 py-2 rounded-lg mt-4 "
        onClick={() => signIn()}
      >
        <h4 className="font-bold">SIGNUP NOW</h4>
      </button>
    </div>
  );
}

export default HeroSection;
