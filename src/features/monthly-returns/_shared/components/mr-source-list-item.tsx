import { useDeleteMonthlySource } from "@bhaisaab/features/monthly-returns/_shared/hooks/use-delete-monthly-source";
import { ConfirmAlertDialog } from "@bhaisaab/shared/components/app/confirm-alert-dialog";
import { Button } from "@bhaisaab/shared/components/core/button";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { formatCurrency } from "@bhaisaab/shared/utils/currency";
import { BanknoteArrowUp, Loader2, Trash2 } from "lucide-react";
import { FC, useState } from "react";
import { useToggle } from "react-use";

interface MRSourceListItemProps {
  index: number;
  type: string;
  source: string;
  amount: string;
}

/**
 * One income source row.
 *
 * `index` is the source's 0-based sheet row, sent as the delete request's id.
 *
 * The delete button asks for confirmation before it sends the request.
 */
export const MRSourceListItem: FC<MRSourceListItemProps> = ({
  index,
  type,
  source,
  amount,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, toggleConfirmOpen] = useToggle(false);
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
          {formatCurrency(Number(amount))}
        </Typography>

        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={toggleConfirmOpen}
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

      <ConfirmAlertDialog
        title="Delete Income Source"
        message={`Are you sure you want to delete ${source}? This action cannot be undone.`}
        actionLabel="Delete"
        onConfirm={handleDelete}
        isOpen={isConfirmOpen}
        onOpenChange={toggleConfirmOpen}
      />
    </div>
  );
};
