"use client";

import { Button } from "@bhaisaab/shared/components/core/button";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { APP_NAME } from "@bhaisaab/shared/constants/app";
import { cn } from "@bhaisaab/shared/utils/shadcn";
import {
  Banknote,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Plus,
  Receipt,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FC } from "react";
import { useToggle } from "react-use";

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const navItems = [
  {
    name: "Monthly Report",
    icon: <BarChart3 />,
    href: "/dashboard/monthly",
  },
  {
    name: "Loan Report",
    icon: <Receipt />,
    href: "/dashboard/loans",
  },
  {
    name: "FD Report",
    icon: <Banknote />,
    href: "/dashboard/deposits",
  },
];

const onSignOut = () => {
  void signOut({
    redirectTo: "/auth/login",
  });
};

export const AppSidebar: FC<SidebarProps> = ({ user }) => {
  const [isCollapsed, toggleSidebar] = useToggle(false);
  const pathname = usePathname();
  const [isUserMenuOpen, toggleUserMenu] = useToggle(false);

  return (
    <div
      className={cn(
        "flex h-screen flex-col bg-charcoal-900 dark:bg-charcoal-100 text-white transition-all duration-300 ease-in-out relative",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Collapse/Expand button - positioned on the right edge */}
      <div className="absolute -right-3 top-8 z-10">
        <button
          onClick={toggleSidebar}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-persian-green-500 text-white shadow-md hover:bg-persian-green-600 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* App header */}
      <div className="flex items-center h-16 px-4">
        {!isCollapsed && (
          <Typography variant="h4" className="flex-1">
            {APP_NAME}
          </Typography>
        )}
      </div>

      {/* Add new button - centered circle when collapsed */}
      <div
        className={cn("px-4 mb-6", isCollapsed ? "flex justify-center" : "")}
      >
        <Button
          variant="primary"
          className={cn(
            isCollapsed
              ? "h-10 w-10 rounded-full p-0 flex items-center justify-center"
              : "w-full justify-start",
          )}
        >
          <Plus size={isCollapsed ? 20 : 16} />
          {!isCollapsed && <span className="ml-2">New sheet</span>}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 mb-2 transition-colors",
              isCollapsed && "justify-center",
              pathname === item.href
                ? "bg-persian-green-500 text-white"
                : "text-gray-300 hover:bg-charcoal-800 dark:hover:bg-charcoal-200",
            )}
          >
            {item.icon}
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* User section - better positioning when collapsed */}
      <div className="mt-auto px-2 pb-4">
        <div
          onClick={toggleUserMenu}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer hover:bg-charcoal-800 dark:hover:bg-charcoal-200",
            isCollapsed && "justify-center",
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal-500 text-white shrink-0">
            {user?.name?.[0] ?? "U"}
          </div>
          {!isCollapsed && (
            <div className="flex-1 truncate">
              <Typography variant="body" className="truncate">
                {user?.name ?? "User"}
              </Typography>
              {user?.email && (
                <Typography
                  variant="small"
                  textColor="muted"
                  className="truncate"
                >
                  {user.email}
                </Typography>
              )}
            </div>
          )}
        </div>

        {/* Settings and Logout buttons */}
        {!isCollapsed && isUserMenuOpen && (
          <div className="mt-2 space-y-1 rounded-md bg-charcoal-800 dark:bg-charcoal-200 p-2">
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-300 hover:bg-charcoal-700 dark:hover:bg-charcoal-300"
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>
            <button
              onClick={onSignOut}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-gray-300 hover:bg-charcoal-700 dark:hover:bg-charcoal-300"
            >
              <LogOut size={18} />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
