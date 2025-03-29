// app/auth/login/page.tsx
import { Login } from "@bhaisaab/shared/pages/auth/login";
import { auth, signIn } from "@bhaisaab/shared/utils/auth/auth";
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
  // Check if user is already authenticated
  const session = await auth();
  const searchParamResult = await searchParams;
  const error = searchParamResult.error;

  if (session) {
    return redirect("/");
  }

  return (
    <form action={handleSignIn}>
      <Login error={error} />
    </form>
  );
}
