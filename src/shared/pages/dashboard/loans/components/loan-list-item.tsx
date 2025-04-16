// @bhaisaab/pages/loans/components/loan-list-item.tsx
import { Badge } from "@bhaisaab/shared/components/core/badge";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { formatCurrency } from "@bhaisaab/shared/utils/currency";
import { cn } from "@bhaisaab/shared/utils/shadcn";
import { AlertCircle, CheckCircle2, CreditCard } from "lucide-react";
import { FC, memo } from "react";

import { LoanActions } from "./loan-actions";

interface LoanListItemProps {
  id: number;
  provider: string;
  loanAmount: string;
  paidAmount: string;
  pendingAmount: string;
}

export const LoanListItem: FC<LoanListItemProps> = memo(
  ({ id, provider, loanAmount, paidAmount, pendingAmount }) => {
    // Convert string values to numbers
    const numLoanAmount = Number(loanAmount) || 0;
    const numPaidAmount = Number(paidAmount) || 0;
    const numPendingAmount = Number(pendingAmount) || 0;

    // Calculate progress percentage
    const progressPercentage =
      numLoanAmount > 0
        ? Math.min(100, Math.round((numPaidAmount / numLoanAmount) * 100))
        : 0;

    // Determine if the loan is fully paid
    const isFullyPaid = numPendingAmount <= 0;

    return (
      <div
        className={`border rounded-lg overflow-hidden shadow-sm bg-card hover:shadow-md transition-shadow flex flex-col
        ${isFullyPaid ? "border-green-300/30" : "border-blue-300/30"}`}
      >
        {/* Top colored strip based on status */}
        <div
          className={`h-1 w-full ${isFullyPaid ? "bg-green-500" : "bg-blue-500"}`}
        />

        <div className="p-4">
          {/* Header with loan provider and status */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="size-5 text-muted-foreground" />
              <Typography variant="h5" weight="semibold">
                {provider}
              </Typography>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={"outline"}
                className={cn(
                  "rounded-full px-3 py-1",
                  isFullyPaid
                    ? "bg-green-500/15 text-green-700 hover:bg-green-500/20 border-green-200"
                    : "bg-blue-500/15 text-blue-700 hover:bg-blue-500/20 border-blue-200",
                )}
              >
                {isFullyPaid ? "Paid" : "Active"}
              </Badge>

              <LoanActions
                id={id}
                provider={provider}
                isFullyPaid={isFullyPaid}
                pendingAmount={numPendingAmount}
              />
            </div>
          </div>

          {/* Loan details */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <Typography variant="body" textColor="muted">
                Total Loan Amount
              </Typography>
              <Typography variant="body" weight="semibold">
                {formatCurrency(numLoanAmount)}
              </Typography>
            </div>

            <div className="flex justify-between">
              <Typography variant="body" textColor="muted">
                Amount Paid
              </Typography>
              <Typography
                variant="body"
                weight="semibold"
                className="text-green-600"
              >
                {formatCurrency(numPaidAmount)}
              </Typography>
            </div>

            <div className="flex justify-between">
              <Typography variant="body" textColor="muted">
                Pending Amount
              </Typography>
              <Typography
                variant="body"
                weight="semibold"
                className={isFullyPaid ? "text-green-600" : "text-blue-600"}
              >
                {formatCurrency(numPendingAmount)}
              </Typography>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Typography variant="small" textColor="muted">
                Payment Progress
              </Typography>
              <Typography variant="small" weight="medium">
                {progressPercentage}%
              </Typography>
            </div>

            <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  isFullyPaid ? "bg-green-500" : "bg-blue-500",
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Status icon and message */}
          <div
            className={cn(
              "mt-4 p-3 rounded-lg flex items-center gap-2",
              isFullyPaid
                ? "bg-green-50 dark:bg-green-950/20"
                : "bg-blue-50 dark:bg-blue-950/20",
            )}
          >
            {isFullyPaid ? (
              <>
                <CheckCircle2 className="size-5 text-green-600 shrink-0" />
                <Typography variant="small">
                  This loan has been fully paid off!
                </Typography>
              </>
            ) : (
              <>
                <AlertCircle className="size-5 text-blue-600 shrink-0" />
                <Typography variant="small">
                  {formatCurrency(numPendingAmount)} remaining to be paid.
                </Typography>
              </>
            )}
          </div>
        </div>
      </div>
    );
  },
);

LoanListItem.displayName = "LoanListItem";
