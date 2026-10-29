import { Typography } from "@bhaisaab/shared/components/core/typography";
import { FC } from "react";

export interface AmountSummaryItemProps {
  amount: number;
  subtitle?: string;
  title: string;
}

export const AmountSummaryItem: FC<AmountSummaryItemProps> = ({
  amount,
  subtitle,
  title,
}) => {
  return (
    <div>
      <Typography variant={"label"} textColor={"muted"}>
        {title}
      </Typography>

      <Typography variant={"h3"} weight={"bold"}>
        ₹{amount}
      </Typography>

      {!!subtitle && (
        <Typography variant={"caption"} textColor={"muted"}>
          {subtitle}
        </Typography>
      )}
    </div>
  );
};
