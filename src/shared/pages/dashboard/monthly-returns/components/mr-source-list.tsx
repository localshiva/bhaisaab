import { Typography } from "@bhaisaab/shared/components/core/typography";
import { IMonthlyReturnsRow } from "@bhaisaab/shared/hooks/services/monthly-return";
import { getTotalIncome } from "@bhaisaab/shared/utils/income";
import { FC, useMemo } from "react";

import { MRSourceListItem } from "./mr-source-list-item";

interface MRSourceListProps {
  rows: IMonthlyReturnsRow[];
}

export const MRSourceList: FC<MRSourceListProps> = ({ rows }) => {
  const totalIncome = useMemo(() => {
    return getTotalIncome(rows);
  }, [rows]);

  return (
    <div className="bg-card rounded-lg border shadow-sm p-4 sm:p-6">
      <Typography variant={"h5"} weight={"semibold"} className="mb-3">
        Monthly Sources
      </Typography>

      <div className="space-y-3">
        {rows.map((row, index) => (
          <MRSourceListItem
            key={`${row[1]}-${index}`}
            index={index + 1} // Convert to 1-based for API
            type={row[0]}
            source={row[1]}
            amount={row[2]}
          />
        ))}

        {/* Total Income */}
        <div className="flex items-center justify-between pt-2">
          <Typography variant={"body"} weight={"bold"}>
            Total{" "}
            <Typography as="span" textColor={"muted"}>
              ({totalIncome.sources} sources)
            </Typography>
          </Typography>
          <Typography variant="body" weight={"bold"}>
            ₹{totalIncome.sum}
          </Typography>
        </div>
      </div>
    </div>
  );
};
