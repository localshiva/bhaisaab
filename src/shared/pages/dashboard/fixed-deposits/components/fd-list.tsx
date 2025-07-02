import { IFixedDepositRow } from "@bhaisaab/shared/hooks/services/fixed-deposits";

import { FDListItem } from "./fd-list-item";

interface FDListItemProps {
  rows: IFixedDepositRow[];
}

export const FDList = ({ rows }: FDListItemProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rows.map(row => {
        // Map column indexes to named properties
        const amountIndex = 0;
        const interestRateIndex = 1;
        const depositDateIndex = 2;
        const maturityDateIndex = 3;

        return (
          <FDListItem
            originalRowIndex={row.originalRowIndex}
            key={`fd-${row.originalRowIndex}`}
            amount={row.data[amountIndex]}
            interestRate={row.data[interestRateIndex]}
            depositDate={row.data[depositDateIndex]}
            maturityDate={row.data[maturityDateIndex]}
          />
        );
      })}
    </div>
  );
};
