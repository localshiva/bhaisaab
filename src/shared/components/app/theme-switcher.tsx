"use client";

import { Button } from "@bhaisaab/shared/components/core/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@bhaisaab/shared/components/core/tooltip";
import { cn } from "@bhaisaab/shared/utils/shadcn";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const themes = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "system", icon: Monitor, label: "System" },
  { value: "dark", icon: Moon, label: "Dark" },
];

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  // Avoid SSR issues
  const effectiveTheme = globalThis.window === undefined ? "system" : theme;

  return (
    <div className={cn("flex items-center gap-4 py-3 rounded-md", className)}>
      {themes.map(({ value, icon: Icon, label }) => (
        <Tooltip key={value}>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant={effectiveTheme === value ? "default" : "ghost"}
              className="size-7"
              onClick={() => setTheme(value)}
              aria-label={`Switch to ${label} theme`}
            >
              <Icon className="size-4" />
              <span className="sr-only">{label}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{label} theme</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
