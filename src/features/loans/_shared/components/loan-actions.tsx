import { useDeleteLoan } from "@bhaisaab/features/loans/_shared/hooks/use-delete-loan";
import { ConfirmAlertDialog } from "@bhaisaab/shared/components/app/confirm-alert-dialog";
import { Button } from "@bhaisaab/shared/components/core/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@bhaisaab/shared/components/core/dropdown-menu";
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

  const [isPaymentsOpen, togglePaymentsOpen] = useToggle(false);

  const handleViewPayments = () => {
    togglePaymentsOpen(true);
    setOpen(false);
  };

  const onDelete = () => {
    toggleDeleteOpen();
    setOpen(false);
  };

  const handleDelete = () => {
    /**
     * The delete request takes a 0-based sheet row. Row 0 is the header,
     * so loan `id` sits at row id + 1.
     */
    const rowIndex = id + 1;

    deleteLoan(
      { rowIndex },
      {
        onSuccess: () => {
          toast.success(`Loan from ${provider} was deleted successfully`);
        },
        onError: error => {
          console.error("Error deleting loan:", error);
          // The mutation's toast meta shows the error to the user.
        },
      },
    );
  };

  const handleAddPayment = () => {
    toggleOpen();
    setOpen(false);
  };

  // 1-based sheet row: row 1 is the header, so loan `id` is row id + 2.
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
