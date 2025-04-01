// @bhaisaab/pages/spreadsheet/monthly-returns/components/mr-source-list-item.tsx
import { Button } from "@bhaisaab/shared/components/core/button";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { useDeleteMonthlySource } from "@bhaisaab/shared/hooks/services/monthly-return";
import { BanknoteArrowUp, Loader2, Trash2 } from "lucide-react";
import { FC, useState } from "react";

interface MRSourceListItemProps {
  index: number;
  type: string;
  source: string;
  amount: string;
}

export const MRSourceListItem: FC<MRSourceListItemProps> = ({
  index,
  type,
  source,
  amount,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteSource, isLoading } = useDeleteMonthlySource();

  const handleDelete = () => {
    setIsDeleting(true);
    deleteSource(
      { id: index, source },
      {
        onSuccess: () => setIsDeleting(false),
        onError: () => setIsDeleting(false),
      },
    );
  };

  const isLoaderVisible = isLoading && isDeleting;

  return (
    <div className="flex items-center justify-between border-b pb-3 border-border">
      <div className="flex items-center gap-2 sm:gap-3">
        <BanknoteArrowUp size={20} className={"text-green-600"} />

        <div>
          <Typography variant={"body"} weight={"medium"}>
            {source}
          </Typography>
          <Typography variant={"small"} textColor={"muted"}>
            {type}
          </Typography>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Typography variant={"body"} weight={"semibold"}>
          ₹{Number.parseInt(amount, 10).toLocaleString()}
        </Typography>

        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleDelete}
          disabled={isLoading && isDeleting}
          aria-label={`Delete ${source}`}
        >
          {isLoaderVisible ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
        </Button>
      </div>
    </div>
  );
};
