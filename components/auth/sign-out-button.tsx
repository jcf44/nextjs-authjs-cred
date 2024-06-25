import { signOut } from "@/auth";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({
          redirectTo: "/",
        });
      }}
    >
      <button
        type="submit"
        className="p-3 border border-slate-300 rounded-md hover:bg-slate-100 hover:text-slate-900"
      >
        Sign Out
      </button>
    </form>
  );
}
