import { SignInButton } from "@/components/auth/sign-in-button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 ">
      <div className="items-center font-bold text-3xl justify-center pb-20">
        Auth.Js Credentials porvider with FastAPI
      </div>
      <div>
        <SignInButton />
      </div>
    </main>
  );
}
