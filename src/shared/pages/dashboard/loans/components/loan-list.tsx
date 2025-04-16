// @bhaisaab/pages/loans/components/loan-list.tsx
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { ILoanRow } from "@bhaisaab/shared/hooks/services/loan";
import { FC } from "react";

import { LoanEmptyList } from "./loan-empty-list";
import { LoanListItem } from "./loan-list-item";

interface LoanListProps {
  rows: ILoanRow[];
}

export const LoanList: FC<LoanListProps> = ({ rows }) => {
  if (rows.length === 0) {
    return <LoanEmptyList />;
  }

  return (
    <div className="bg-card rounded-lg border shadow-sm p-4 sm:p-6">
      <Typography variant="h5" weight="semibold" className="mb-4">
        Your Loans
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((row, index) => (
          <LoanListItem
            key={`loan-${index}`}
            id={index}
            provider={row[0]}
            loanAmount={row[1]}
            paidAmount={row[2]}
            pendingAmount={row[3]}
          />
        ))}
      </div>
    </div>
  );
};
