// @bhaisaab/pages/spreadsheet/loan-report/components/loan-payments-dialog.tsx
import { Button } from "@bhaisaab/shared/components/core/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@bhaisaab/shared/components/core/dialog";
import { Separator } from "@bhaisaab/shared/components/core/separator";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import {
  ILoanPayment,
  useLoanPayments,
} from "@bhaisaab/shared/hooks/services/loan";
import { formatCurrency } from "@bhaisaab/shared/utils/currency";
import { format } from "date-fns";
import { Banknote, CalendarIcon, Loader2 } from "lucide-react";
import { FC } from "react";

interface LoanPaymentsDialogProps {
  rowIndex: number;
  provider: string;
  isOpen: boolean;
  toggleOpen: (open: boolean) => void;
}

export const LoanPaymentsDialog: FC<LoanPaymentsDialogProps> = ({
  rowIndex,
  provider,
  isOpen,
  toggleOpen,
}) => {
  const { data: payments, isLoading } = useLoanPayments(rowIndex);

  // Calculate total amount paid
  const totalPaid =
    payments?.reduce((sum, payment) => sum + payment.amount, 0) ?? 0;

  // Build a payment display function
  const getPaymentDate = (columnIndex: number) => {
    // This is a placeholder - in a real app, you might want to store
    // actual payment dates. Here we're generating fake dates based on column index.
    const baseDate = new Date();
    baseDate.setMonth(
      baseDate.getMonth() - (payments?.length ?? 0) + (columnIndex - 4),
    );
    return format(baseDate, "MMM d, yyyy");
  };

  // Render functions to keep the JSX clean
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="size-8 text-primary animate-spin mb-2" />
      <Typography variant="body" textColor="muted">
        Loading payment history...
      </Typography>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Banknote className="size-12 text-muted-foreground mb-2" />
      <Typography variant="h6" className="mb-1">
        No payments found
      </Typography>
      <Typography variant="body" textColor="muted">
        There are no recorded payments for this loan yet.
      </Typography>
    </div>
  );

  const renderPaymentsList = () => (
    <>
      <div className="bg-muted/30 rounded-lg p-4 mb-4">
        <Typography variant="h6" className="mb-2">
          Payment Summary
        </Typography>
        <div className="flex justify-between">
          <Typography variant="body" textColor="muted">
            Total Payments
          </Typography>
          <Typography variant="body" weight="semibold">
            {payments?.length}
          </Typography>
        </div>
        <div className="flex justify-between mt-1">
          <Typography variant="body" textColor="muted">
            Total Amount Paid
          </Typography>
          <Typography
            variant="body"
            weight="semibold"
            className="text-green-600"
          >
            {formatCurrency(totalPaid)}
          </Typography>
        </div>
      </div>

      <Typography variant="body" weight="medium" className="mb-2">
        Payment Details
      </Typography>

      <div className="space-y-3">
        {payments?.map((payment: ILoanPayment, index: number) => (
          <div
            key={`payment-${index}`}
            className="bg-card border rounded-lg p-3"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Banknote className="size-4 text-green-600" />
                <Typography variant="body" weight="medium">
                  Payment #{index + 1}
                </Typography>
              </div>
              <Typography
                variant="body"
                weight="semibold"
                className="text-green-600"
              >
                {formatCurrency(payment.amount)}
              </Typography>
            </div>
            <div className="flex items-center gap-1 mt-2 text-muted-foreground">
              <CalendarIcon className="size-3" />
              <Typography variant="small" textColor="muted">
                {getPaymentDate(payment.columnIndex)}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // Content renderer based on state
  const renderContent = () => {
    if (isLoading) {
      return renderLoading();
    }

    if (!payments || payments.length === 0) {
      return renderEmptyState();
    }

    return renderPaymentsList();
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment History for {provider}</DialogTitle>
          <DialogDescription>
            Review all payments made towards this loan.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 max-h-[60vh] overflow-y-auto">
          {renderContent()}
        </div>

        <Separator />

        <DialogFooter>
          <Button onClick={() => toggleOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
