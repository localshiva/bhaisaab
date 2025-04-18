"use client";
import { SidebarTrigger } from "@bhaisaab/shared/components/core/sidebar";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { useSpreadsheetInfo } from "@bhaisaab/shared/hooks/services/spreadsheet-info";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_SPREADSHEET_TITLE = "Bhaisaab";
const SCROLL_THRESHOLD = 50; // Pixels to scroll before triggering hide/show

export function DashboardHeader() {
  const { data: spreadsheetInfo, isLoading } = useSpreadsheetInfo();
  const spreadsheetTitle = isLoading
    ? "Loading..."
    : (spreadsheetInfo?.data.spreadsheetTitle ?? DEFAULT_SPREADSHEET_TITLE);

  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    if (!ticking.current) {
      globalThis.requestAnimationFrame(() => {
        // Always show at top
        if (currentScrollY <= 0) {
          setVisible(true);
        }
        // Scrolling up significantly
        else if (lastScrollY.current - currentScrollY > SCROLL_THRESHOLD) {
          setVisible(true);
          lastScrollY.current = currentScrollY;
        }
        // Scrolling down significantly
        else if (currentScrollY - lastScrollY.current > SCROLL_THRESHOLD) {
          setVisible(false);
          lastScrollY.current = currentScrollY;
        }

        ticking.current = false;
      });

      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <header
      className={`bg-card border-b border-border h-16 flex items-center px-4 w-full sticky top-0 left-0 z-10 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center gap-1">
        <SidebarTrigger />

        <Typography variant="h6" weight="semibold" className="text-foreground">
          {spreadsheetTitle}
        </Typography>
      </div>
    </header>
  );
}
