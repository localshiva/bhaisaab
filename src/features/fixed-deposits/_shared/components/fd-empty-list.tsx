import { Typography } from "@bhaisaab/shared/components/core/typography";
import { ListPlus } from "lucide-react";

import { FDCreateForm } from "./fd-create-form";

export const FDEmptyList = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-card border rounded-lg p-8 text-center">
      <ListPlus className="size-12 text-muted-foreground mb-4" />
      <Typography variant="h5" weight="semibold">
        No fixed deposits yet
      </Typography>
      <Typography variant="body" textColor="muted" className="mt-1 mb-4">
        Create your first fixed deposit to track interest and maturity.
      </Typography>

      <FDCreateForm />
    </div>
  );
};
