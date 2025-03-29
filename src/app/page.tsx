import { AppSidebar } from "@bhaisaab/shared/components/app/app-sidebar";
import { auth } from "@bhaisaab/shared/utils/auth/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <main>
      <AppSidebar user={session?.user} />
    </main>
  );
}
