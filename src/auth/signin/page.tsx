import { Button } from "@/components/ui/button";
import { SigninForm } from "./_components/signin-form";
import Link from "next/link";
import { OAuthSigninButtons } from "@/components/oauth-signin-buttons";

export default function SignInPage() {
  return (
    <main className="mt-4">
      <div className="container">
        <h1 className="text-3xl font-bold tracking-tight">SignIn</h1>
        <div className="my-4 h-1 bg-muted" />
        <SigninForm />
        <div className="my-4 h-1 bg-muted" />
        <OAuthSigninButtons />
        <div className="my-4 h-1 bg-muted" />
        <p>
          Don&apos;t have an account? Click
          <Button variant="link" size="sm" className="px-0" asChild>
            <Link href="/auth/signup" className="px-2">
              here
            </Link>
          </Button>
          to sign up.
        </p>
      </div>
    </main>
  );
}
