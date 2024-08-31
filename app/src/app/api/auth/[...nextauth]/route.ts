import { prismaClient } from "@/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "", // Handle missing env vars gracefully
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "", // Handle missing env vars gracefully
    }),
  ],

  callbacks: {
    async signIn(params) {
      if (!params.user.email) {
        return false;
      }
      // console.log(params);

      try {
        const existingUser = await prismaClient.user.findUnique({
          where: {
            email: params.user.email,
          },
        });
        if (existingUser) {
          return true;
        }
        await prismaClient.user.create({
          data: {
            email: params.user.email,
            provider: "Google",
          },
        });
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
