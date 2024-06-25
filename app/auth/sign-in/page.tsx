// "use client";
import { SignIn } from "@/components/auth/sign-in";

const SignInPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <SignIn />
    </div>
  );
};

export default SignInPage;
