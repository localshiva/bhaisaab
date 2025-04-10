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
import { useDeleteLoan } from "@bhaisaab/shared/hooks/services/loan";
import {
  DollarSign,
  Loader2,
  MoreVertical,
  Receipt,
  Trash2,
} from "lucide-react";
import { FC, useState } from "react";
import { useToggle } from "react-use";
import { toast } from "sonner";

import { LoanPaymentForm } from "./loan-payment-form";
import { LoanPaymentsDialog } from "./loan-payments-dialog";

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
  const [isDeleteOpen, toggleDeleteOpen] = useToggle(false);
  const { deleteLoan, isLoading: isDeleting } = useDeleteLoan();

  // Then inside the LoanActions component, add a new state:
  const [isPaymentsOpen, togglePaymentsOpen] = useToggle(false);

  // Replace the handleViewPayments function with:
  const handleViewPayments = () => {
    togglePaymentsOpen(true);
    setOpen(false);
  };

  const onDelete = () => {
    toggleDeleteOpen();
    setOpen(false);
  };

  const handleDelete = () => {
    // Important: The spreadsheet rows start at 1,
    // but the header is at row 1, so we need to add 2 to the 0-based id
    const rowIndex = id + 1;

    deleteLoan(
      { rowIndex },
      {
        onSuccess: () => {
          toast.success(`Loan from ${provider} was deleted successfully`);
        },
        onError: error => {
          console.error("Error deleting loan:", error);
          // Error handling will be done by the hook and toast notifications
        },
      },
    );
  };

  const handleAddPayment = () => {
    toggleOpen();
    setOpen(false);
  };

  // The spreadsheet rows start at 1, header at row 1, so add 2 to the 0-based id
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
          {/* Add Payment Item */}
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

          <DropdownMenuItem
            onClick={onDelete}
            variant="destructive"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LoanPaymentForm
        rowIndex={actualRowIndex}
        provider={provider}
        pendingAmount={pendingAmount}
        isOpen={isOpen}
        toggleOpen={toggleOpen}
      />

      <ConfirmAlertDialog
        message={`Are you sure you want to delete this loan from ${provider}? This action cannot be undone.`}
        actionLabel="Delete"
        onConfirm={handleDelete}
        isOpen={isDeleteOpen}
        onOpenChange={toggleDeleteOpen}
      />

      <LoanPaymentsDialog
        rowIndex={actualRowIndex}
        provider={provider}
        isOpen={isPaymentsOpen}
        toggleOpen={togglePaymentsOpen}
      />
    </>
  );
};
