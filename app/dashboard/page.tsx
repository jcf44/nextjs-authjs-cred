import { auth } from "@/auth";
import { SignOut } from "@/components/auth/sign-out-button";

const Dashboard = async () => {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <h1 className="text-3xl font-bold mb-9">Dashboard</h1>
        <div className="text-center">
          <h2 className="text-xl font-bold mb-9">
            Welcome, {session.user.name}
          </h2>

          <p>Your email is: {session.user.email}</p>

          <p className="p-3">Your access token is ... </p>
          <input
            type="text"
            value={session.user.accessToken}
            className="w-fit p-2 mb-9 border-2 border-slate-300 rounded-md text-slate-600"
          />
        </div>
        <SignOut />
      </div>
    </div>
  );
};

export default Dashboard;
