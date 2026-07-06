import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Lightweight config for middleware — no Prisma dependency
export const { auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // Middleware only needs to verify the JWT exists, not the user
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
});
