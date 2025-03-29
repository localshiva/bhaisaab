import { signIn } from "@bhaisaab/shared/utils/auth/auth";

export const Login = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <button type="submit">Sign in</button>
    </form>
  );
};
