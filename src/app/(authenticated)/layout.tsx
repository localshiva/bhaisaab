import { AppSidebar } from "@bhaisaab/shared/components/app/app-sidebar/app-sidebar";
import { auth } from "@bhaisaab/shared/utils/auth/auth";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <>
      <AppSidebar user={session?.user} />
      <main>{children}</main>
    </>
  );
}
