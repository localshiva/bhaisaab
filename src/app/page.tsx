import { signOut } from "@bhaisaab/shared/utils/auth/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

async function handleSignOut() {
  "use server";

  try {
    return await signOut({
      redirectTo: "/auth/login",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return redirect(`/auth/login?error=${error.type}`);
    }

    throw error;
  }
}

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      <form action={handleSignOut}>
        <button type="submit">Sign out</button>
      </form>
    </div>
  );
}
