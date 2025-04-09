import { Typography } from "@bhaisaab/shared/components/core/typography";

import {
  AmountSummaryItem,
  AmountSummaryItemProps,
} from "./amount-summary-item";

export interface AmountSummaryCardProps {
  rows: AmountSummaryItemProps[];
  title: string;
}

export const AmountSummaryCard = ({ rows, title }: AmountSummaryCardProps) => {
  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <Typography variant="h5" weight={"semibold"} textColor={"default"}>
        {title}
      </Typography>

      <div className="flex flex-wrap justify-between gap-x-4 gap-y-8 items-center p-3 bg-card/50 rounded-md border mt-4">
        {rows.map((row, index) => (
          <AmountSummaryItem key={index} {...row} />
        ))}
      </div>
    </div>
  );
};
