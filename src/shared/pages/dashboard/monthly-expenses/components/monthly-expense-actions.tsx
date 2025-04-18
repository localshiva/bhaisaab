// @bhaisaab/pages/monthly-expense/components/monthly-expense-actions.tsx
import { Button } from "@bhaisaab/shared/components/core/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@bhaisaab/shared/components/core/dropdown-menu";
import { DollarSign, MoreVertical, Plus, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useToggle } from "react-use";

import { AdditionalPaymentForm } from "./additional-payment-form";
import { MonthlyExpenseForm } from "./monthly-expense-form";

interface IMonthlyExpenseActionsProps {
  id: number;
  date: string;
  canAddExpenses: boolean;
}

export const MonthlyExpenseActions: FC<IMonthlyExpenseActionsProps> = ({
  id,
  date,
  canAddExpenses,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isAddExpenseOpen, toggleAddExpenseOpen] = useToggle(false);
  const [isAddPaymentOpen, toggleAddPaymentOpen] = useToggle(false);

  const handleAddExpense = () => {
    toggleAddExpenseOpen(true);
    setOpen(false);
  };

  const handleAddPayment = () => {
    toggleAddPaymentOpen(true);
    setOpen(false);
  };

  // The spreadsheet rows start at 1, header at row 1, so add 2 to the 0-based id
  const actualRowIndex = id + 2;

  const handleViewDetails = () => {
    // Navigate to the details page with query params
    const queryString = `?rowIndex=${actualRowIndex}&date=${encodeURIComponent(date)}&canAddExpenses=${canAddExpenses}`;
    router.push(`/monthly-expenses/monthly-expense-details${queryString}`);

    setOpen(false);
  };

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
          {/* Add Additional Payment - only for current and previous month */}
          {canAddExpenses ? (
            <DropdownMenuItem onSelect={handleAddPayment}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Add Payment</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              disabled
              className="opacity-50 cursor-not-allowed"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>Add Payment</span>
            </DropdownMenuItem>
          )}

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

          <DropdownMenuItem onSelect={handleViewDetails}>
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

      <AdditionalPaymentForm
        rowIndex={actualRowIndex}
        date={date}
        isOpen={isAddPaymentOpen}
        toggleOpen={toggleAddPaymentOpen}
      />
    </>
  );
};
