import { IFixedDepositRow } from "@bhaisaab/shared/hooks/services/fixed-deposits";

import { FDListItem } from "./fd-list-item";

interface FDListItemProps {
  rows: IFixedDepositRow[];
}

export const FDList = ({ rows }: FDListItemProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rows.map((row, index) => {
        // Map column indexes to named properties
        const amountIndex = 0;
        const interestRateIndex = 1;
        const depositDateIndex = 2;
        const maturityDateIndex = 3;

        return (
          <FDListItem
            id={index + 1}
            key={`fd-${index}`}
            amount={row[amountIndex]}
            interestRate={row[interestRateIndex]}
            depositDate={row[depositDateIndex]}
            maturityDate={row[maturityDateIndex]}
          />
        );
      })}
    </div>
  );
};
