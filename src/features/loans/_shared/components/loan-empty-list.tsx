import { useAddLoanModalStore } from "@bhaisaab/features/loans/_shared/hooks/use-open-add-loan-form";
import { Button } from "@bhaisaab/shared/components/core/button";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { CreditCard, Plus } from "lucide-react";

/**
 * Shown when the sheet has no loans.
 *
 * Its button opens the page header's add loan dialog through the shared
 * store. Rendering a second `AddLoanForm` here would open two dialogs,
 * since both read the same open flag.
 */
export const LoanEmptyList = () => {
  const openAddLoan = useAddLoanModalStore(state => state.openAddLoan);

  return (
    <div className="flex flex-col items-center justify-center bg-card border rounded-lg p-8 text-center">
      <CreditCard className="size-12 text-muted-foreground mb-4" />
      <Typography variant="h5" weight="semibold">
        No loans added yet
      </Typography>
      <Typography variant="body" textColor="muted" className="mt-1 mb-4">
        Add your first loan to track payments and pending amounts.
      </Typography>

      <Button variant="outline" onClick={openAddLoan}>
        <Plus className="size-4" />
        <span>Add new loan</span>
      </Button>
    </div>
  );
};
