import Link from "next/link";
import { SignupForm } from "./_components/signup-form";
import { Button } from "@/components/ui/button";
import { OAuthSigninButtons } from "@/components/oauth-signin-buttons";

const SignUpPage = () => {
  return (
    <main className="mt-4">
      <div className="container">
        <h1 className="text-3xl font-bold tracking-tight">SignUp</h1>
        <div className="my-4 h-1 bg-muted" />
        <SignupForm />
        <div className="my-4 h-1 bg-muted" />
        <OAuthSigninButtons signup />
        <div className="my-4 h-1 bg-muted" />
        <p>
          Already have an account? Click
          <Button variant="link" size="sm" className="px-0" asChild>
            <Link href="/auth/signin" className="px-2">
              here
            </Link>
          </Button>
          to sign in.
        </p>
      </div>
    </main>
  );
};

export default SignUpPage;
