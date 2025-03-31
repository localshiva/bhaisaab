import { Typography } from "@bhaisaab/shared/components/core/typography";
import { FC } from "react";

interface Props {
  sum: number;
  sources: number;
  title: string;
}

export const MRSummaryItem: FC<Props> = ({ sum, sources, title }) => {
  return (
    <div>
      <Typography variant={"label"} textColor={"muted"}>
        {title}
      </Typography>

      <Typography variant={"h3"} weight={"bold"}>
        ₹{sum}
      </Typography>

      {/* Number of months */}
      <Typography variant={"caption"} textColor={"muted"}>
        {sources} sources
      </Typography>
    </div>
  );
};
