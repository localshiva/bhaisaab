"use client";

import { Typography } from "@bhaisaab/shared/components/core/typography";
import { cn } from "@bhaisaab/shared/utils/shadcn";
import {
  Banknote,
  BarChart3,
  ChevronRight,
  LogOut,
  Plus,
  Receipt,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FC, useEffect, useRef, useState } from "react";
import { useToggle } from "react-use";

import { SidebarHeader } from "./sidebar-header";

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
    icon: <BarChart3 size={22} />,
    href: "/dashboard/monthly",
  },
  {
    name: "Loan Report",
    icon: <Receipt size={22} />,
    href: "/dashboard/loans",
  },
  {
    name: "FD Report",
    icon: <Banknote size={22} />,
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={cn(
        "flex h-screen flex-col bg-charcoal-900 dark:bg-charcoal-100 text-white border-r border-charcoal-800 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* App header - fixed height */}
      <SidebarHeader isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      {/* New button - fixed position for icon */}
      <div className="flex items-center h-14">
        <div className="w-16 flex justify-center">
          <div
            className="w-10 h-10 rounded-full bg-sandy-brown-500 flex items-center justify-center cursor-pointer hover:bg-sandy-brown-600 transition-colors"
            onClick={() => {
              /* Add new sheet functionality */
            }}
          >
            <Plus size={22} color="white" />
          </div>
        </div>

        {/* Text only shows when expanded */}
        {!isCollapsed && (
          <Typography variant="body" className="pl-1">
            New sheet
          </Typography>
        )}
      </div>

      {/* Navigation items - fixed position for icons */}
      <nav className="flex-1">
        {navItems.map(item => (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                "flex items-center h-12",
                pathname === item.href
                  ? "bg-persian-green-500/20"
                  : "hover:bg-charcoal-800/50 dark:hover:bg-charcoal-200/30",
              )}
            >
              <div className="w-16 flex justify-center">
                <div
                  className={cn(
                    "text-gray-300",
                    pathname === item.href ? "text-persian-green-500" : "",
                  )}
                >
                  {item.icon}
                </div>
              </div>

              {/* Text only shows when expanded */}
              {!isCollapsed && (
                <Typography
                  variant="body"
                  className={cn(
                    "pl-1",
                    pathname === item.href
                      ? "text-persian-green-500"
                      : "text-gray-300",
                  )}
                >
                  {item.name}
                </Typography>
              )}
            </div>
          </Link>
        ))}
      </nav>

      {/* User avatar - fixed position */}
      <div className="mt-auto relative" ref={menuRef}>
        <div
          className="flex items-center cursor-pointer h-14"
          onClick={() => !isCollapsed && setIsUserMenuOpen(!isUserMenuOpen)}
        >
          <div className="w-16 flex justify-center">
            <div className="w-10 h-10 bg-charcoal-700 rounded-full flex items-center justify-center">
              {user?.name?.[0] ?? "U"}
            </div>
          </div>

          {/* User info only shows when expanded */}
          {!isCollapsed && (
            <div className="pl-1 flex-1 py-2">
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

          {/* Dropdown indicator only shows when expanded */}
          {!isCollapsed && (
            <div className="pr-4">
              <ChevronRight
                size={16}
                className={cn(
                  "transition-transform",
                  isUserMenuOpen ? "rotate-90" : "",
                )}
              />
            </div>
          )}
        </div>

        {/* Settings and Logout dropdown */}
        {!isCollapsed && isUserMenuOpen && (
          <div className="absolute bottom-full left-0 w-full z-10 mb-2 pt-2">
            <div className="mx-4 rounded-md overflow-hidden shadow-lg border border-charcoal-700 dark:border-charcoal-500">
              <div className="p-3 bg-charcoal-800 dark:bg-charcoal-300">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-charcoal-700 rounded-full flex items-center justify-center text-sm">
                    {user?.name?.[0] ?? "U"}
                  </div>
                  <div>
                    <Typography
                      variant="body"
                      weight="medium"
                      className="truncate"
                    >
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
                </div>
              </div>

              <div className="bg-charcoal-900 dark:bg-charcoal-200">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-charcoal-800 dark:hover:bg-charcoal-300 transition-colors"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>

                <button
                  onClick={onSignOut}
                  className="flex w-full items-center gap-3 px-4 py-3 text-gray-300 hover:bg-charcoal-800 dark:hover:bg-charcoal-300 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
