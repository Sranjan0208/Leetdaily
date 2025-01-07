"use client";
import { signoutUserAction } from "@/actions/signout-user-actions";
import { Button } from "@/components/ui/button";

export const SignOutButton = () => {
  const clickHandler = async () => {
    await signoutUserAction();
    window.location.href = "/";
  };

  return (
    <Button variant="destructive" size="sm" onClick={clickHandler}>
      Sign Out
    </Button>
  );
};
