import NextAuth, { User, type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's access token from OAuth or JWT provider. */
      accessToken: string;
      tokenType: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;

        // const { username, password } = await signInSchema.parseAsync(
        //   credentials
        // );

        // logic to salt and hash password
        // const pwHash = saltAndHashPassword(credentials.password);

        // logic to verify if user exists
        // user = await getUserFromDb(credentials.username, pwHash);

        const params = new URLSearchParams();
        params.append("username", credentials.username as string);
        params.append("password", credentials.password as string);

        const response = await fetch(
          "http://localhost:8000/api/v1/login/oauth",
          {
            method: "POST",
            // headers: { "Content-Disposition": params },
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params,
          }
        );

        // console.log("Response: ", response);

        if (!response.ok) {
          throw new Error("Invalid credentials");
        }

        user = await response.json();

        if (!user) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error("User not found.");
        }

        // You can also return some other properties from the API call if you want
        user["name"] = credentials.username;
        user["email"] = "johndoe@me.com";

        // return user object with the their profile data
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.username = user.name;
        token.accessToken = user.access_token;
        token.tokenType = user.token_type;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.user.id = token.id as string;
      session.user.name = token.username as string;
      session.user.accessToken = token.accessToken as string;
      session.user.tokenType = token.tokenType as string;
      return session;
    },
  },
});
