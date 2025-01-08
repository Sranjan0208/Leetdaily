import { Button } from "@/components/ui/button";
import { SigninForm } from "./_components/signin-form";
import Link from "next/link";
import { OAuthSigninButtons } from "@/components/oauth-signin-buttons";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-black text-gray-200">
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-16 sm:px-8 lg:px-10">
        <div className="space-y-6 text-center">
          <h1 className="bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-6xl font-extrabold leading-tight text-transparent">
            Welcome Back!
            <br />
            Sign In to Continue
          </h1>
          <p className="text-xl text-gray-400">
            Access your account, track progress, and achieve greatness.
          </p>
        </div>

        {/* Sign-In Form */}
        <div className="mx-auto mt-10 max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-gray-100">
            Sign In to Your Account
          </h2>
          <SigninForm />
          <div className="my-4 h-1 bg-gray-700" />
          <OAuthSigninButtons />
        </div>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-gray-400">
          Don&apos;t have an account? Click{" "}
          <Button variant="link" size="sm" className="px-0" asChild>
            <Link
              href="/auth/signup"
              className="px-1 font-semibold text-indigo-700"
            >
              here
            </Link>
          </Button>{" "}
          to sign up.
        </p>
      </div>
    </div>
  );
}
