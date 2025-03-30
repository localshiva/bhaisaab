import { AppSidebar } from "@bhaisaab/shared/components/app/app-sidebar/app-sidebar";
import { getUserCredentials } from "@bhaisaab/shared/utils/auth/auth";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserCredentials();

  return (
    <>
      <AppSidebar user={user} />
      <main className="w-full">{children}</main>
    </>
  );
}
