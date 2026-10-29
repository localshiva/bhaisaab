import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@bhaisaab/shared/components/core/alert-dialog";
import { FC, useCallback } from "react";

interface ConfirmAlertDialogProps {
  message: string;
  actionLabel?: string;
  onConfirm: () => void;
  buttonContent?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ConfirmAlertDialog: FC<ConfirmAlertDialogProps> = ({
  message,
  actionLabel = "Confirm",
  onConfirm,
  buttonContent,
  isOpen = false,
  onOpenChange = () => null,
}) => {
  const renderChildren = useCallback(
    () => (
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Fixed Deposit</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    ),
    [actionLabel, message, onConfirm],
  );

  if (!buttonContent) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        {renderChildren()}
      </AlertDialog>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{buttonContent}</AlertDialogTrigger>

      {renderChildren()}
    </AlertDialog>
  );
};
