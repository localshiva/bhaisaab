"use client";

import { useSpreadsheetInfo } from "@bhaisaab/shared/hooks/services/spreadsheet-info";

export default function Dashboard() {
  const { data: spreadsheetInfo, isLoading } = useSpreadsheetInfo();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(spreadsheetInfo, null, 2)}</pre>
    </div>
  );
}
