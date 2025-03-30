"use client";
import { SidebarTrigger } from "@bhaisaab/shared/components/core/sidebar";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { useSpreadsheetInfo } from "@bhaisaab/shared/hooks/services/spreadsheet-info";

const DEFAULT_SPREADSHEET_TITLE = "Bhaisaab";

export function DashboardHeader() {
  const { data: spreadsheetInfo, isLoading } = useSpreadsheetInfo();
  const spreadsheetTitle = isLoading
    ? "Loading..."
    : (spreadsheetInfo?.data.spreadsheetTitle ?? DEFAULT_SPREADSHEET_TITLE);

  return (
    <header className="bg-card border-b border-border h-16 flex items-center px-4 w-full">
      <div className="flex items-center gap-1">
        <SidebarTrigger />

        <Typography variant="h6" weight="semibold" className="text-foreground">
          {spreadsheetTitle}
        </Typography>
      </div>
    </header>
  );
}
