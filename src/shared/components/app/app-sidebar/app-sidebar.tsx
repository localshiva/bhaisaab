"use client";

import { AppSidebarHeader } from "@bhaisaab/shared/components/app/app-sidebar/app-sidebar-header";
import { Sidebar } from "@bhaisaab/shared/components/core/sidebar";
import { User } from "next-auth";

import SidebarNav from "./sidebar-nav";

interface AppSidebarProps {
  user?: User;
}

export const AppSidebar = ({ user }: AppSidebarProps) => {
  console.info(user);
  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />
      <SidebarNav />
    </Sidebar>
  );
};
