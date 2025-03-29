import { cn } from "@bhaisaab/shared/utils/shadcn";
import { Banknote, BarChart3, Receipt } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Typography } from "../../core/typography";

interface SidebarNavProps {
  isCollapsed: boolean;
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

export default function SidebarNav({ isCollapsed }: SidebarNavProps) {
  const pathname = usePathname();

  return (
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
  );
}
