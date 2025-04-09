"use client";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { useLoans } from "@bhaisaab/shared/hooks/services/loan";

import { AddLoanForm } from "./components/add-loan-form";
import { LoanList } from "./components/loan-list";
import { LoanSummaryCard } from "./components/loan-summary-card";

export default function Loans() {
  const { isLoading, data } = useLoans();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data?.rows) {
    return <div>No data found</div>;
  }

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto p-4">
      <div className="w-full flex justify-between items-center">
        <Typography variant={"h4"} weight={"semibold"}>
          Loans
        </Typography>

        {/* Add a new loan */}
        <AddLoanForm />
      </div>

      {/* Main summary card */}
      <LoanSummaryCard rows={data.rows} />

      {/* Display loan list */}
      <LoanList rows={data.rows} />
    </div>
  );
}
