import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@bhaisaab/shared/components/core/sidebar";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { Banknote, BarChart3, Home, Plus, Receipt } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

interface INavItem {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  url: string;
}

const navItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/dashboard",
  },
  {
    title: "Monthly Returns",
    icon: BarChart3,
    url: "/dashboard/monthly-returns",
  },
  {
    title: "Monthly Report",
    icon: BarChart3,
    url: "/dashboard/monthly",
  },
  {
    title: "Loan Report",
    icon: Receipt,
    url: "/dashboard/loans",
  },
  {
    title: "FD Report",
    icon: Banknote,
    url: "/dashboard/deposits",
  },
];

export default function SidebarNav() {
  const pathname = usePathname();

  const renderItem = useCallback(
    (item: INavItem) => {
      const { title, url, icon: Icon } = item;

      return (
        <SidebarMenuItem key={title}>
          <SidebarMenuButton asChild isActive={url === pathname}>
            <Link href={url}>
              <Icon />
              <span>
                <Typography variant={"label"}>{title}</Typography>
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    },
    [pathname],
  );

  return (
    <SidebarContent>
      {/* Nav links */}
      <SidebarGroup>
        <SidebarGroupLabel>
          <Typography textColor="muted" variant={"small"}>
            Reports
          </Typography>
        </SidebarGroupLabel>

        <SidebarGroupAction title="Add Project">
          <Plus /> <span className="sr-only">Add Project</span>
        </SidebarGroupAction>

        <SidebarGroupContent>
          <SidebarMenu>
            {navItems.map(navItem => renderItem(navItem))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
