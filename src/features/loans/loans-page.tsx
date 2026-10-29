"use client";
import { AddLoanForm } from "@bhaisaab/features/loans/_shared/components/add-loan-form";
import { LoanList } from "@bhaisaab/features/loans/_shared/components/loan-list";
import { LoanSummaryCard } from "@bhaisaab/features/loans/_shared/components/loan-summary-card";
import { useLoans } from "@bhaisaab/features/loans/_shared/hooks/use-loans";
import { DataLoading } from "@bhaisaab/shared/components/app/data-loading";
import { Typography } from "@bhaisaab/shared/components/core/typography";

export default function Loans() {
  const { isLoading, data } = useLoans();

  if (isLoading) {
    return <DataLoading />;
  }

  if (!data?.rows) {
    return (
      <div className="flex flex-col gap-4 max-w-6xl mx-auto p-4">
        No data found
      </div>
    );
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
