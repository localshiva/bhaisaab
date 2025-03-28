"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback } from "react";

import { Button } from "../core/button";

const themes = [
  { value: "light", icon: Sun, title: "Light theme" },
  { value: "system", icon: Monitor, title: "System theme" },
  { value: "dark", icon: Moon, title: "Dark theme" },
];

export default function ThemeSwitcher() {
  const { setTheme } = useTheme();

  const renderThemeButton = useCallback(
    ({ value, icon: Icon, title }: (typeof themes)[number]) => (
      <Button
        key={title}
        onClick={() => setTheme(value)}
        title={title}
        aria-label={title}
      >
        <Icon className="h-4 w-4" />
      </Button>
    ),
    [setTheme],
  );

  return (
    <div className="inline-flex items-center rounded-lg bg-background p-1 space-x-1 shadow-sm">
      {themes.map(theme => renderThemeButton(theme))}
    </div>
  );
}
