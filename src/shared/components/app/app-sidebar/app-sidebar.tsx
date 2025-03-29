"use client";

import { cn } from "@bhaisaab/shared/utils/shadcn";
import { FC } from "react";
import { useToggle } from "react-use";

import { SidebarHeader } from "./sidebar-header";
import SidebarNav from "./sidebar-nav";
import SidebarNew from "./sidebar-new";
import SidebarUser from "./sidebar-user";

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export const AppSidebar: FC<SidebarProps> = ({ user }) => {
  const [isCollapsed, toggleSidebar] = useToggle(false);

  return (
    <div
      className={cn(
        "flex h-screen flex-col bg-charcoal-900 dark:bg-charcoal-100 text-white border-r border-charcoal-800 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* App header - fixed height */}
      <SidebarHeader isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      {/* New button */}
      <SidebarNew isCollapsed={isCollapsed} />

      {/* Navigation items */}
      <SidebarNav isCollapsed={isCollapsed} />

      {/* User avatar - fixed position */}
      <SidebarUser isCollapsed={isCollapsed} user={user} />
    </div>
  );
};
