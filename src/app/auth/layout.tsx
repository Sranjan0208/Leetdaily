import React from "react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await auth();

  // if (session) {
  //   redirect("/profile");
  // }

  return <>{children}</>;
}
