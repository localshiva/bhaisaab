import { Badge } from "@bhaisaab/shared/components/core/badge";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import {
  calculateMonthlyInterest,
  calculateTotalInterest,
  isMatured,
} from "@bhaisaab/shared/hooks/services/fixed-deposits";
import { formatCurrency } from "@bhaisaab/shared/utils/currency";
import { cn } from "@bhaisaab/shared/utils/shadcn";
import { CalendarClock, CalendarIcon, Percent, Wallet } from "lucide-react";
import { FC, memo } from "react";

import { FDListItemActions } from "./fd-list-item-actions";

interface FDListItemProps {
  id: number; // Added ID for delete functionality
  amount: string;
  interestRate: string;
  depositDate: string;
  maturityDate: string;
}

export const FDListItem: FC<FDListItemProps> = memo(
  ({ id, amount, interestRate, depositDate, maturityDate }) => {
    // Convert string values to numbers
    const numAmount = Number.parseFloat(amount);
    const numInterestRate = Number.parseFloat(interestRate);

    // Calculate interest and status
    const monthlyInterest = calculateMonthlyInterest(
      numAmount,
      numInterestRate,
    );
    const totalInterest = calculateTotalInterest(
      numAmount,
      numInterestRate,
      depositDate,
      maturityDate,
    );
    const matured = isMatured(maturityDate);

    // Format dates for display
    const formattedDepositDate = new Date(depositDate).toLocaleDateString();
    const formattedMaturityDate = new Date(maturityDate).toLocaleDateString();

    // Calculate days remaining until maturity
    const daysUntilMaturity = Math.max(
      0,
      Math.ceil(
        (new Date(maturityDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      ),
    );

    return (
      <div
        className={`border rounded-lg overflow-hidden shadow-sm bg-card hover:shadow-md transition-shadow flex flex-col ${matured ? "border-amber-300/30" : "border-green-300/30"}`}
      >
        {/* Top colored strip based on status */}
        <div
          className={`h-1 w-full ${matured ? "bg-amber-500" : "bg-green-500"}`}
        />

        <div className="p-5">
          {/* Header with amount and badge */}
          <div className="flex justify-between items-start mb-5">
            <div>
              <Typography
                variant="body"
                textColor="muted"
                className="text-xs mb-1"
              >
                Fixed Deposit
              </Typography>
              <Typography
                variant="h4"
                weight="semibold"
                className="leading-none"
              >
                {formatCurrency(numAmount)}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={"outline"}
                className={`rounded-full px-3 py-1 ${matured ? "bg-amber-500/15 text-amber-700 hover:bg-amber-500/20 border-amber-200" : "bg-green-500/15 text-green-700 hover:bg-green-500/20 border-green-200"}`}
              >
                {matured ? "Matured" : "Active"}
              </Badge>

              {/* Delete Dialog */}
              <FDListItemActions
                id={id}
                amount={numAmount}
                interestRate={numInterestRate}
                depositDate={formattedDepositDate}
                maturityDate={formattedMaturityDate}
              />
            </div>
          </div>

          {/* Interest rate and monthly interest side by side */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-card/50 rounded-lg p-3 border">
              <div className="flex items-center mb-1">
                <Percent className="size-3.5 mr-1.5 text-muted-foreground" />
                <Typography variant="small" textColor="muted">
                  Interest Rate
                </Typography>
              </div>
              <Typography variant="h5" weight="semibold" className="text-lg">
                {numInterestRate}%
              </Typography>
            </div>

            <div className="bg-card/50 rounded-lg p-3 border">
              <div className="flex items-center mb-1">
                <Wallet className="size-3.5 mr-1.5 text-muted-foreground" />
                <Typography variant="small" textColor="muted">
                  Monthly Interest
                </Typography>
              </div>
              <Typography variant="h5" weight="semibold" className="text-lg">
                {formatCurrency(monthlyInterest)}
              </Typography>
            </div>
          </div>

          {/* Dates and progress */}
          <div className="space-y-4">
            {/* Date information */}
            <div className="flex justify-between border-t pt-4">
              <div className="flex items-center">
                <CalendarIcon className="size-3.5 mr-1.5 text-muted-foreground" />
                <Typography variant="small" textColor="muted">
                  From {formattedDepositDate}
                </Typography>
              </div>
              <div className="flex items-center">
                <CalendarClock className="size-3.5 mr-1.5 text-muted-foreground" />
                <Typography variant="small" textColor="muted">
                  To {formattedMaturityDate}
                </Typography>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Typography variant="small" textColor="muted">
                  Maturity Progress
                </Typography>
                <Typography
                  variant="small"
                  weight="medium"
                  className={daysUntilMaturity <= 30 ? "text-amber-600" : ""}
                >
                  {daysUntilMaturity} days left
                </Typography>
              </div>
              <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full bg-green-500 rounded-full",
                    matured ? "bg-amber-500" : "bg-green-500",
                  )}
                  style={{
                    width: `${Math.min(100, Math.max(5, 100 - (daysUntilMaturity / (new Date(maturityDate).getTime() - new Date(depositDate).getTime())) * 86_400_000 * 100))}%`,
                  }}
                />
              </div>
            </div>

            {/* Total Interest */}
            <div
              className={`mt-4 p-4 rounded-lg ${matured ? "bg-amber-50 dark:bg-amber-950/20" : "bg-green-50 dark:bg-green-950/20"}`}
            >
              <div className="flex justify-between items-center">
                <Typography variant="body" weight="medium">
                  Total Expected Interest
                </Typography>
                <Typography
                  variant="h5"
                  weight="bold"
                  className={matured ? "text-amber-600" : "text-green-600"}
                >
                  {formatCurrency(totalInterest)}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

FDListItem.displayName = "FDListItem";
