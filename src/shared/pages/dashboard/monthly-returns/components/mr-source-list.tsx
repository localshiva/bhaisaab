import { Typography } from "@bhaisaab/shared/components/core/typography";
import { IMonthlyReturnsRow } from "@bhaisaab/shared/hooks/services/monthly-return";
import { BanknoteArrowUp } from "lucide-react";
import { FC } from "react";

interface MRSourceListProps {
  rows: IMonthlyReturnsRow[];
}

export const MRSourceList: FC<MRSourceListProps> = ({ rows }) => {
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
                <p className="font-medium text-sm sm:text-base text-foreground">
                  {row[1]}
                </p>
                <p className="text-xs text-muted-foreground">{row[0]}</p>
              </div>
            </div>

            <span className="font-semibold text-sm sm:text-base text-foreground">
              ₹{Number.parseInt(row[2], 10).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
