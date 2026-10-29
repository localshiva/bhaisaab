import { IIncomeSource } from "@bhaisaab/features/monthly-returns/_shared/types/monthly-returns";
import { getTotalIncome } from "@bhaisaab/features/monthly-returns/_shared/utils/income";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { formatCurrency } from "@bhaisaab/shared/utils/currency";
import { FC, useMemo } from "react";

import { MRSourceListItem } from "./mr-source-list-item";

interface MRSourceListProps {
  sources: IIncomeSource[];
}

/** Lists every income source with a delete button, then the total. */
export const MRSourceList: FC<MRSourceListProps> = ({ sources }) => {
  const totalIncome = useMemo(() => {
    return getTotalIncome(sources);
  }, [sources]);

  return (
    <div className="bg-card rounded-lg border shadow-sm p-4 sm:p-6">
      <Typography variant={"h5"} weight={"semibold"} className="mb-3">
        Monthly Sources
      </Typography>

      <div className="space-y-3">
        {sources.map(({ id, type, source, amount }) => (
          <MRSourceListItem
            key={id}
            index={id}
            type={type}
            source={source}
            amount={amount}
          />
        ))}

        <div className="flex items-center justify-between pt-2">
          <Typography variant={"body"} weight={"bold"}>
            Total{" "}
            <Typography as="span" textColor={"muted"}>
              ({totalIncome.sources} sources)
            </Typography>
          </Typography>
          <Typography variant="body" weight={"bold"}>
            {formatCurrency(totalIncome.sum)}
          </Typography>
        </div>
      </div>
    </div>
  );
};
