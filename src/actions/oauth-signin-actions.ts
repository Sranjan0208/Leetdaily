"use server";

import { signIn } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function oauthSigninAction(provider: "google" | "github") {
  try {
    await signIn(provider, { redirectTo: "/dashboard" });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
  }
}
