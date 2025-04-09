// @bhaisaab/pages/spreadsheet/loan-report/components/loan-actions.tsx
import { ConfirmAlertDialog } from "@bhaisaab/shared/components/app/confirm-alert-dialog";
import { Button } from "@bhaisaab/shared/components/core/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@bhaisaab/shared/components/core/dropdown-menu";
import { DollarSign, MoreVertical, Receipt, Trash2 } from "lucide-react";
import { FC, useState } from "react";
import { useToggle } from "react-use";
import { toast } from "sonner";

import { LoanPaymentForm } from "./loan-payment-form";

interface LoanActionsProps {
  id: number;
  provider: string;
  isFullyPaid: boolean;
  pendingAmount: number;
}

export const LoanActions: FC<LoanActionsProps> = ({
  id,
  provider,
  isFullyPaid,
  pendingAmount,
}) => {
  const [open, setOpen] = useState(false);
  const [isOpen, toggleOpen] = useToggle(false);

  const handleViewPayments = () => {
    // This would be replaced with your actual implementation
    toast.info("View payments feature coming soon");
    setOpen(false);
  };

  const handleDelete = () => {
    // This would be replaced with your actual implementation
    toast.info("Delete loan feature coming soon");
    setOpen(false);
  };

  const handleAddPayment = () => {
    toggleOpen();
    setOpen(false);
  };

  // Important: The spreadsheet rows start at 1,
  // but the header is at row 1, so we need to add 2 to the 0-based id
  // First row = header (row 1)
  // Data starts at row 2
  // So for id=0, we need row 2
  // For id=1, we need row 3, etc.
  const actualRowIndex = id + 2;

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {/* Add Payment Item - Uses the LoanPaymentForm instead of a direct click handler */}
          {!isFullyPaid && (
            <DropdownMenuItem onSelect={handleAddPayment}>
              <DollarSign className="mr-2 h-4 w-4" />
              <span>Add Payment</span>
            </DropdownMenuItem>
          )}

          {isFullyPaid && (
            <DropdownMenuItem
              disabled
              className="opacity-50 cursor-not-allowed"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              <span>Fully Paid</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={handleViewPayments}>
            <Receipt className="mr-2 h-4 w-4" />
            <span>View Payments</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <ConfirmAlertDialog
            message={`Are you sure you want to delete this loan from ${provider}? This action cannot be undone.`}
            actionLabel="Delete"
            onConfirm={handleDelete}
            buttonContent={
              <DropdownMenuItem
                onClick={e => e.preventDefault()}
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <LoanPaymentForm
        rowIndex={actualRowIndex} // Using the corrected row index
        provider={provider}
        pendingAmount={pendingAmount}
        isOpen={isOpen}
        toggleOpen={toggleOpen}
      />
    </>
  );
};
