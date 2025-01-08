import { NextAuthConfig } from "next-auth";
import { OAuthVerifyEmailAction } from "./actions/oauth-verify-email-action";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "./drizzle";
import * as schema from "@/drizzle/schema";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";

export const authConfig = {
  adapter: DrizzleAdapter(db, {
    accountsTable: schema.accounts,
    usersTable: schema.users,
    authenticatorsTable: schema.authenticators,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
  }),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    authorized({ auth, request }) {
      const { nextUrl } = request;

      const isLoggedIn = !!auth?.user;
      const isOnProfile = nextUrl.pathname.startsWith("/dashboard");
      const isOnAuth = nextUrl.pathname.startsWith("/auth");

      if (isOnProfile) {
        if (isLoggedIn) return true;
        return Response.redirect(new URL("/auth/signin", nextUrl));
      }

      if (isOnAuth) {
        if (!isLoggedIn) return true;
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
    },
    jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      if (user?.id) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      return session;
    },

    signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        return !!profile?.email_verified; // Email verified is from google not from our table
      }
      if (account?.provider === "github") {
        return !!profile?.email_verified;
      }
      if (account?.provider === "credentials") {
        if (user.emailVerified) {
          // return true;
        }
        return true;
      }
      return false;
    },
  },
  events: {
    async linkAccount({ user, account }) {
      if (["google", "github"].includes(account.provider)) {
        if (user.email) await OAuthVerifyEmailAction(user.email);
      }
    },
  },
  pages: { signIn: "/auth/signin" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
} satisfies NextAuthConfig;
