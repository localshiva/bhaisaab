"use client";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { useLoans } from "@bhaisaab/shared/hooks/services/loan";

import { AddLoanForm } from "./components/add-loan-form";

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

        <AddLoanForm />
      </div>
    </div>
  );
}
