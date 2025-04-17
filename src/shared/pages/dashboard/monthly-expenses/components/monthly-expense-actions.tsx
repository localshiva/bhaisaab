// @bhaisaab/pages/monthly-expense/components/monthly-expense-actions.tsx
import { Button } from "@bhaisaab/shared/components/core/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@bhaisaab/shared/components/core/dropdown-menu";
import { DollarSign, MoreVertical, Receipt } from "lucide-react";
import { FC, useState } from "react";
import { useToggle } from "react-use";

import { MonthlyExpenseDetailsDialog } from "./monthly-expense-details-dialog";
import { MonthlyExpenseForm } from "./monthly-expense-form";

interface MonthlyExpenseActionsProps {
  id: number;
  date: string;
  canAddExpenses: boolean;
}

export const MonthlyExpenseActions: FC<MonthlyExpenseActionsProps> = ({
  id,
  date,
  canAddExpenses,
}) => {
  const [open, setOpen] = useState(false);
  const [isAddExpenseOpen, toggleAddExpenseOpen] = useToggle(false);
  const [isDetailsOpen, toggleDetailsOpen] = useToggle(false);

  const handleAddExpense = () => {
    toggleAddExpenseOpen(true);
    setOpen(false);
  };

  const handleViewDetails = () => {
    toggleDetailsOpen(true);
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
          {/* Add Expense Item - only for current and previous month */}
          {canAddExpenses ? (
            <DropdownMenuItem onSelect={handleAddExpense}>
              <DollarSign className="mr-2 h-4 w-4" />
              <span>Add Expense</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              disabled
              className="opacity-50 cursor-not-allowed"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              <span>Locked Month</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={handleViewDetails}>
            <Receipt className="mr-2 h-4 w-4" />
            <span>View Details</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MonthlyExpenseForm
        rowIndex={actualRowIndex}
        date={date}
        isOpen={isAddExpenseOpen}
        toggleOpen={toggleAddExpenseOpen}
      />

      <MonthlyExpenseDetailsDialog
        rowIndex={actualRowIndex}
        date={date}
        isOpen={isDetailsOpen}
        toggleOpen={toggleDetailsOpen}
        canAddExpenses={canAddExpenses}
      />
    </>
  );
};
