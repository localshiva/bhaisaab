import { Login } from "@bhaisaab/features/auth/login/_shared/components/login";
import { signIn } from "@bhaisaab/shared/server/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

/**
 * Starts Google sign-in. An Auth.js error sends the user back here
 * with its type in `?error=`, which the Login component shows as a toast.
 */
async function handleSignIn() {
  "use server";

  try {
    return await signIn("google", {
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return redirect(`/auth/login?error=${error.type}`);
    }

    throw error;
  }
}

/** Login page. The whole card is a form that submits the sign-in action. */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
  }>;
}) {
  const searchParamResult = await searchParams;
  const error = searchParamResult.error;

  return (
    <form action={handleSignIn} className="w-full">
      <Login error={error} />
    </form>
  );
}
