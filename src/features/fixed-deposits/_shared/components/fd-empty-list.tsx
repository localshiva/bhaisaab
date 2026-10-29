import { useAddFDStore } from "@bhaisaab/features/fixed-deposits/_shared/hooks/use-add-fd-store";
import { Button } from "@bhaisaab/shared/components/core/button";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { ListPlus, Plus } from "lucide-react";

/**
 * Shown when the sheet has no deposits.
 *
 * Its button opens the page header's create dialog through the shared
 * store. Rendering a second `FDCreateForm` here would open two dialogs,
 * since both read the same open flag.
 */
export const FDEmptyList = () => {
  const openAddFD = useAddFDStore(state => state.openAddFD);

  return (
    <div className="flex flex-col items-center justify-center bg-card border rounded-lg p-8 text-center">
      <ListPlus className="size-12 text-muted-foreground mb-4" />
      <Typography variant="h5" weight="semibold">
        No fixed deposits yet
      </Typography>
      <Typography variant="body" textColor="muted" className="mt-1 mb-4">
        Create your first fixed deposit to track interest and maturity.
      </Typography>

      <Button variant="outline" onClick={openAddFD}>
        <Plus className="size-4" />
        <span>Add new</span>
      </Button>
    </div>
  );
};
