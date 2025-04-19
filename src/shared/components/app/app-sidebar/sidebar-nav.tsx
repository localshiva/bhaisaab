import {
  SidebarContent,
  SidebarGroup,
  // SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@bhaisaab/shared/components/core/sidebar";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { useIsMobile } from "@bhaisaab/shared/hooks/use-mobile";
import {
  Banknote,
  BanknoteArrowUp,
  BarChart3,
  // Plus,
  Receipt,
} from "lucide-react";
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
    title: "Monthly Expenses",
    icon: BarChart3,
    url: "/monthly-expenses",
  },
  {
    title: "FD Report",
    icon: Banknote,
    url: "/fixed-deposits",
  },
  {
    title: "Loan Report",
    icon: Receipt,
    url: "/loans",
  },
  {
    title: "Monthly Returns",
    icon: BanknoteArrowUp,
    url: "/monthly-returns",
  },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();

  const handleToggleSidebar = useCallback(() => {
    if (isMobile) {
      toggleSidebar();
    }
  }, [isMobile, toggleSidebar]);

  const renderItem = useCallback(
    (item: INavItem) => {
      const { title, url, icon: Icon } = item;

      return (
        <SidebarMenuItem key={title}>
          <SidebarMenuButton asChild isActive={url === pathname}>
            <Link href={url} onClick={handleToggleSidebar}>
              <Icon />
              <span>
                <Typography variant={"label"}>{title}</Typography>
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    },
    [handleToggleSidebar, pathname],
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

        <SidebarGroupContent>
          <SidebarMenu>
            {navItems.map(navItem => renderItem(navItem))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
