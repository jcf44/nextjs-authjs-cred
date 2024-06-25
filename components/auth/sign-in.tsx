import { redirect } from "next/navigation";
import { signIn } from "@/auth";

export function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        // onSubmit={handleSubmit}
        action={async (formData) => {
          "use server";
          try {
            const data = Object.fromEntries(formData);
            await signIn("credentials", {
              //   redirectTo: "/dashboard",
              redirect: false,
              username: data.username,
              password: data.password,
            });
            // Redirect to home page or other page after successful sign-in
          } catch (error) {
            console.log("Error: ", error);
          } finally {
            redirect("/dashboard");
          }
        }}
      >
        <label className="block m-3">
          Username:
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            className="ml-2 p-2 rounded text-slate-950"
          />
        </label>
        <label className="block m-3">
          Password:
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="ml-2 p-2 rounded text-slate-950"
          />
        </label>
        <button
          type="submit"
          className="p-3 border border-slate-300 rounded-md hover:bg-slate-100 hover:text-slate-900 w-full"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
