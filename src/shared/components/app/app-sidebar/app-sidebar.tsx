"use client";

import { AppSidebarHeader } from "@bhaisaab/shared/components/app/app-sidebar/app-sidebar-header";
import {
  Sidebar,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@bhaisaab/shared/components/core/sidebar";
import { User } from "next-auth";

import SidebarNav from "./sidebar-nav";
import SidebarUser from "./sidebar-user";

interface AppSidebarProps {
  user?: User;
}

export const AppSidebar = ({ user }: AppSidebarProps) => {
  const { isMobile } = useSidebar();

  return (
    <>
      {isMobile && <SidebarTrigger />}

      <Sidebar collapsible="icon">
        <AppSidebarHeader />
        <SidebarNav />
        <SidebarUser user={user} />
        <SidebarRail />
      </Sidebar>
    </>
  );
};
