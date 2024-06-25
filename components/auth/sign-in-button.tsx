"use client";

import { signIn } from "next-auth/react";

export function SignInButton() {
  return (
    <button
      onClick={() => signIn()}
      className="p-3 border border-slate-300 rounded-md hover:bg-slate-100 hover:text-slate-900"
    >
      Sign in
    </button>
  );
}
