import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const res = await axios.post(
            "http://localhost:3000/api/auth/signIn",
            {
              username: credentials?.username,
              password: credentials?.password,
            }
          );

          if (res.status === 200) {
            const { userId } = res.data;
            console.log("authorize return", {
              id: userId,
              username: credentials?.username,
            });
            return { id: userId, username: credentials?.username };
          } else {
            throw new Error("Login failed, please try again");
          }
        } catch (error: any) {
          if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data?.message || "Unknown error";

            if (status === 400) {
              throw new Error("MissingCredentials");
            } else if (status === 401) {
              throw new Error("InvalidCredentials");
            } else if (status === 500) {
              throw new Error("ServerError");
            } else {
              throw new Error("UnexpectedError");
            }
          } else {
            throw new Error("UnknownError");
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      account,
      profile,
      user,
    }: {
      token: any;
      account: any;
      profile: any;
      user: any;
    }) {
      console.log("user in jwt", user);
      console.log("token in jwt", token);
      if (user) {
        token.username = user.username;
        token.id = user.id;
      }
      console.log("return of jwt", token);
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log("token in session", token);
      console.log("session in session", session);

      session.user.id = token.id as string;
      session.user.username = token.username as string;
      console.log("return of session", session);
      return session;
    },
  },
  pages: {
    error: "/auth/error", // 👈 tell NextAuth to use your custom error page
  },
};

//http://localhost:3000
