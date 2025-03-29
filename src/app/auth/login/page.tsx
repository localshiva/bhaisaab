// app/auth/login/page.tsx
import { Login } from "@bhaisaab/shared/pages/auth/login";
import { signIn } from "@bhaisaab/shared/utils/auth/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

// Handle the sign in action
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
