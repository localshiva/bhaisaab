"use client";

import { AppSidebarHeader } from "@bhaisaab/shared/components/app/app-sidebar/app-sidebar-header";
import { Sidebar } from "@bhaisaab/shared/components/core/sidebar";

import SidebarNav from "./sidebar-nav";

export const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />
      <SidebarNav />
    </Sidebar>
  );
};
