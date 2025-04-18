import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@bhaisaab/shared/components/core/collapsible";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLocalStorage } from "react-use";

import {
  AmountSummaryItem,
  AmountSummaryItemProps,
} from "./amount-summary-item";

export interface IAmountSummaryCardProps {
  rows: AmountSummaryItemProps[];
  title: string;
  defaultOpen?: boolean;
  collapsedStateId: string; // Used to store the collapsed state in localStorage
}

export const AmountSummaryCard = ({
  rows,
  title,
  defaultOpen = true,
  collapsedStateId,
}: IAmountSummaryCardProps) => {
  const [isOpen, setIsOpen] = useLocalStorage(
    `amount-summary-${collapsedStateId}`,
    defaultOpen,
  );

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="bg-card rounded-lg border shadow-sm p-6"
    >
      <CollapsibleTrigger asChild className="cursor-pointer">
        <div className="flex justify-between items-center">
          <Typography variant="h5" weight="semibold" textColor="default">
            {title}
          </Typography>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-8 items-center p-3 bg-card/50 rounded-md border mt-4">
          {rows.map((row, index) => (
            <AmountSummaryItem key={index} {...row} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
