"use client";

import { Sidebar, SidebarRail } from "@bhaisaab/shared/components/core/sidebar";
import { User } from "next-auth";

import SidebarNav from "./sidebar-nav";
import SidebarUser from "./sidebar-user";

interface AppSidebarProps {
  user?: User;
}

export const AppSidebar = ({ user }: AppSidebarProps) => {
  return (
    <Sidebar collapsible="icon">
      <SidebarNav />
      <SidebarUser user={user} />
      <SidebarRail />
    </Sidebar>
  );
};
