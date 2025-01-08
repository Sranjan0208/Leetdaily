"use client";

import { oauthSigninAction } from "@/actions/oauth-signin-actions";
import { Button } from "./ui/button";
import { FaGoogle, FaGithub } from "react-icons/fa";

type OAuthSigninButtonsProps = {
  signup?: boolean;
};

export const OAuthSigninButtons = ({ signup }: OAuthSigninButtonsProps) => {
  const text = signup ? "Sign up" : "Sign in";

  const clickHandler = async (provider: "google" | "github") => {
    await oauthSigninAction(provider);
  };

  return (
    <div className="max-w-[400px]">
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => clickHandler("google")}
      >
        <FaGoogle className="mr-2" /> {text} with Google
      </Button>

      <Button
        variant="secondary"
        className="mt-4 w-full"
        onClick={() => clickHandler("github")}
      >
        <FaGithub className="mr-2" /> {text} with GitHub
      </Button>
    </div>
  );
};
