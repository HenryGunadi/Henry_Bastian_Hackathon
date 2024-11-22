// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { signIn } from "next-auth/react";

const tokenData = {
  assetName: process.env.NEXT_PUBLIC_TOKEN,
  policyID: process.env.NEXT_PUBLIC_POLICY_ID,
};

export const authOptions: NextAuthOptions = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {},
};
