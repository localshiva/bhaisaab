import { Typography } from "@bhaisaab/shared/components/core/typography";
import { IMonthlyReturnsRow } from "@bhaisaab/shared/hooks/services/monthly-return";
import { getTotalIncome } from "@bhaisaab/shared/utils/income";
import { BanknoteArrowUp } from "lucide-react";
import { FC, useMemo } from "react";

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
        {rows.map(row => (
          <div
            key={row[1]}
            className="flex items-center justify-between border-b pb-3 border-border"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <BanknoteArrowUp size={20} className={"text-green-600"} />

              <div>
                <Typography variant={"body"} weight={"medium"}>
                  {row[1]}
                </Typography>
                <Typography variant={"small"} textColor={"muted"}>
                  {row[0]}
                </Typography>
              </div>
            </div>

            <Typography variant={"body"} weight={"semibold"}>
              ₹{Number.parseInt(row[2], 10).toLocaleString()}
            </Typography>
          </div>
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
