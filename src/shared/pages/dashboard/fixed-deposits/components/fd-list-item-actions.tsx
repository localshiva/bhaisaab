import { ConfirmAlertDialog } from "@bhaisaab/shared/components/app/confirm-alert-dialog";
import { Button } from "@bhaisaab/shared/components/core/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@bhaisaab/shared/components/core/dropdown-menu";
import { useDeleteFixedDeposit } from "@bhaisaab/shared/hooks/services/fixed-deposits";
import { formatCurrency } from "@bhaisaab/shared/utils/currency";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Copy, Loader2, MoreVertical, Trash2 } from "lucide-react";
import { FC } from "react";
import { useToggle } from "react-use";
import { toast } from "sonner";

import { useAddFDStore } from "../hooks/use-add-fd-store";

interface FDListItemActionsProps {
  id: number; // Added ID for delete functionality
  amount: number;
  interestRate: number;
  depositDate: string;
  maturityDate: string;
}

export const FDListItemActions: FC<FDListItemActionsProps> = ({
  id,
  amount,
  interestRate,
  depositDate,
  maturityDate,
}) => {
  const [open, toggleOpen] = useToggle(false);
  const { openAddFD, setDefaultValues } = useAddFDStore();
  const { deleteFixedDeposit, isDeleting } = useDeleteFixedDeposit();
  const [isDeleteOpen, toggleDeleteOpen] = useToggle(false);

  const onCopy = () => {
    openAddFD();
    setDefaultValues({ amount, interestRate, depositDate, maturityDate });
    toggleOpen(false);
  };

  const onDelete = () => {
    toggleDeleteOpen();
    toggleOpen(false);
  };

  // Handle delete action
  const handleDelete = () => {
    if (typeof id === "number") {
      deleteFixedDeposit(id);
    } else {
      toast.error("Fixed deposit ID should be a row number");
    }
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={toggleOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          {/* Copy to create a new fixed deposit */}
          <DropdownMenuItem onClick={onCopy}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Delete */}
          <DropdownMenuItem
            onClick={onDelete}
            variant="destructive"
            disabled={isDeleting}
            className="cursor-pointer"
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

      <ConfirmAlertDialog
        isOpen={isDeleteOpen}
        onOpenChange={toggleDeleteOpen}
        message={`Are you sure you want to delete this fixed deposit of ${formatCurrency(amount)}? This action cannot be undone.`}
        actionLabel={isDeleting ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
      />
    </>
  );
};
