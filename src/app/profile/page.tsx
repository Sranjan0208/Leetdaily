import { auth } from "@/auth";
import { SignOutButton } from "@/components/signout-button";
import { Button } from "@/components/ui/button";
import { User } from "next-auth";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();

  return (
    <main className="mt-4">
      <div className="container">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <div className="my-4 h-1 bg-muted" />

        {!!session?.user ? <SignedIn user={session.user} /> : <SignedOut />}
      </div>
    </main>
  );
}

const SignedIn = ({ user }: { user: User }) => {
  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight">User Information</h2>
      <table className="mt-4 table-auto divide-y">
        <thead>
          <tr className="divide-x">
            <th className="bg-gray-50 px-6 py-3 text-start">ID</th>
            <th className="bg-gray-50 px-6 py-3 text-start">Name</th>
            <th className="bg-gray-50 px-6 py-3 text-start">Email</th>
            <th className="bg-gray-50 px-6 py-3 text-start">Role</th>
          </tr>
        </thead>

        <tbody>
          <tr className="divide-x">
            <td className="px-6 py-4">{user.id}</td>
            <td className="px-6 py-4">{user.name || "NULL"}</td>
            <td className="px-6 py-4">{user.email}</td>
          </tr>
        </tbody>
      </table>

      <div className="my-2 h-1 bg-muted" />
      <SignOutButton />
    </>
  );
};

const SignedOut = () => {
  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight">User not signed in</h2>
      <div className="my-2 h-1 bg-muted" />

      <Button asChild>
        <Link href="/auth/signin">Sign In</Link>
      </Button>
    </>
  );
};
