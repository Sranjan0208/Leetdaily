import Link from "next/link";
import { SignupForm } from "./_components/signup-form";
import { Button } from "@/components/ui/button";
import { OAuthSigninButtons } from "@/components/oauth-signin-buttons";

const SignUpPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-black text-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="space-y-6 text-center">
          <h1 className="bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-6xl font-extrabold leading-tight text-transparent">
            Create Your Account
          </h1>
          <p className="text-xl text-gray-400">
            Join now to start solving coding challenges and tracking your
            progress.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-gray-100">
            Sign Up to Your Account
          </h2>
          <SignupForm />
        </div>
        <div className="mt-6 text-center text-gray-400">
          Already have an account? Click{" "}
          <Button
            variant="link"
            size="sm"
            className="px-0 text-indigo-600"
            asChild
          >
            <Link
              href="/auth/signin"
              className="px-1 font-semibold text-indigo-700"
            >
              here
            </Link>
          </Button>{" "}
          to sign in.
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
