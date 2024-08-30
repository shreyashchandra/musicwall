"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

function Appbar() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between p-3 shadow-sm shadow-slate-700 px-10 cursor-pointer">
      <div className="font-bold text-3xl text-blue-100">MusicWall</div>
      <div className="font-semibold text-lg text-blue-50">
        {session ? (
          <button onClick={() => signOut()}>Sign Out</button>
        ) : (
          <button onClick={() => signIn()}>Sign In</button>
        )}
      </div>
    </div>
  );
}

export default Appbar;
