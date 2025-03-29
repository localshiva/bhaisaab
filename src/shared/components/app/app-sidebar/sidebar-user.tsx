import { LogOut } from "lucide-react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useToggle } from "react-use";

import { Typography } from "../../core/typography";

interface SidebarUserProps {
  isCollapsed: boolean;
  user?: User;
}

const onSignOut = () => {
  void signOut({
    redirectTo: "/auth/login",
  });
};

export default function SidebarUser({ isCollapsed, user }: SidebarUserProps) {
  const [isUserMenuOpen, toggleUserMenu] = useToggle(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        toggleUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleUserMenu]);

  return (
    <div className="mt-auto relative" ref={menuRef}>
      <div
        className="flex items-center cursor-pointer h-14"
        onClick={toggleUserMenu}
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
      </div>

      {/* Settings and Logout dropdown */}
      {isUserMenuOpen && (
        <div className="absolute bottom-full left-0 w-full z-10 mb-2 pt-2">
          <button
            onClick={onSignOut}
            className="flex w-full items-center gap-3 px-4 py-3 text-gray-300 hover:bg-charcoal-800 dark:hover:bg-charcoal-300 transition-colors"
          >
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  );
}
