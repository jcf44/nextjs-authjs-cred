# Next.js + Auth.js + FastAPI

## Getting Started

This project was created with the intention of testing [Auth.js](https://authjs.dev/) and [FastAPI](https://fastapi.tiangolo.com/) together. In the code you can see how Auth.js and FastAPI work together using the [authjs-credentials](https://authjs.dev/getting-started/authentication/credentials) provider calling an external API.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, install dependencies:

```bash
npm install
```

and run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Some useful explanations

The first think to do is follow the [Auth.js introduction guide](https://authjs.dev/getting-started) documentation and choose the framework [Next.js](https://authjs.dev/getting-started/installation?framework=next.js).

When you are done, configure the credentials provider as described in [authjs-credentials](https://authjs.dev/getting-started/authentication/credentials).

Look at the auth.ts in the root of the project to see how the credentials provider is configured. Initialize the Credentials provider in the Auth.js (auth.ts) configuration file. You’ll have to import the provider and add it to your providers array.

```ts
providers: [
    Credentials({ ... })
```

You can specify which fields should be submitted, by adding keys to the `credentials` object.
> e.g. domain, username, password, 2FA token, etc.

```ts
credentials: {
    username: {},
    password: {},
},
```

Use the authorize function to validate the credentials and call the API endpoint with the credentials for the authentication request.

```ts
authorize: async (credentials) => {
        let user = null;

        const params = new URLSearchParams();
        params.append("username", credentials.username as string);
        params.append("password", credentials.password as string);

        const response = await fetch(
          "http://localhost:8000/api/v1/login/oauth",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params,
          }
        );

        if (!response.ok) {
          throw new Error("Invalid credentials");
        }

        user = await response.json();

        if (!user) {
          throw new Error("User not found.");
        }

        return user;
      },
```

You must take into account that the API endpoint must return a JSON object with the user information, this information could contain some user data (ID, name, email), and in our case the access token.

Then the callbacks (jwt and session) are used to validate the user and store the session with the appropriate information obtained from the API.

```ts
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
```

Just play with those callbacks to see how it works and arrange the user session to store the correct information for your needs. In our case, we use the `id` and `username` to store the user session and the `accessToken` to store the access token for future requests to the API.

It is important to add to the session strategy:

```ts
session: {
    strategy: "jwt",
},
```

and if you will use a custom page for the login (something that I recommend) then add it to the section pages:

```ts
pages: {
    signIn: "/auth/sign-in",
},
```

Then define the pages for the login and logout, and use the `signIn` from `next-auth/react`, in the project case a component is used and then imported in the sign-in page. The component is located in the `components/auth/sign-in-button.tsx` file.

```tsx
import { signIn } from "next-auth/react";

export function SignInButton() {
  return (
    <button
      onClick={() => signIn()}
      className="..."
    >
      Sign in
    </button>
  );
}
```

This signIn function will redirect the user to the login page (That was defined in the `pages {signIn: ...}` section of the auth.js file).

The last think to notice is the action of the login form in the sign-in-button component (sign-in-button.tsx).

```ts
async (formData) => {
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
```

When the signIn function is called, it will trigger the authorize function (in the auth.ts file) for calling the API and will redirect the user to the dashboard if no error is thrown.

I hope this helps you to get started with Auth.js and a call to an external API.
