import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@bhaisaab/shared/components/core/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@bhaisaab/shared/components/core/sidebar";
import { ChevronUp, Loader2, User2 } from "lucide-react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import { useToggle } from "react-use";

import { ThemeSwitcher } from "../theme-switcher";

interface SidebarUserProps {
  user?: User;
}

export default function SidebarUser({ user }: SidebarUserProps) {
  const [isSigningOut, toggleIsSigningOut] = useToggle(false);

  const onSignOut = async () => {
    toggleIsSigningOut();

    try {
      await signOut({
        redirectTo: "/auth/login",
      });
    } catch (error) {
      reportError(error);
    } finally {
      toggleIsSigningOut();
    }
  };

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          {isSigningOut ? (
            <SidebarMenuButton disabled>
              <Loader2 className="animate-spin mr-2" size={16} />
              Signing out...
            </SidebarMenuButton>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {user?.name ?? "User"}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[var(--radix-popper-anchor-width)]"
              >
                <ThemeSwitcher className="justify-center" />

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onSignOut}>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
