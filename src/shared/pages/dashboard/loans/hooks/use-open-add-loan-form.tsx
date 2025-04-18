// @bhaisaab/shared/pages/dashboard/loans/hooks/use-open-add-loan-form.tsx
import { create } from "zustand";

interface IAddLoanModalState {
  isAddLoanOpen: boolean;
  openAddLoan: () => void;
  closeAddLoan: () => void;
  toggleAddLoan: () => void;
}

export const useAddLoanModalStore = create<IAddLoanModalState>(set => ({
  isAddLoanOpen: false,
  openAddLoan: () => set({ isAddLoanOpen: true }),
  closeAddLoan: () => set({ isAddLoanOpen: false }),
  toggleAddLoan: () => set(state => ({ isAddLoanOpen: !state.isAddLoanOpen })),
}));
