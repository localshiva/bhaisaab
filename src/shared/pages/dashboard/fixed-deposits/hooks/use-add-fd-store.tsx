// @bhaisaab/shared/pages/dashboard/fixed-deposits/hooks/use-add-fd-modal.tsx
import { CreateFixedDepositRequest } from "@bhaisaab/shared/constants/validation/fixed-deposits";
import { create } from "zustand";

interface IAddFDState {
  defaultValues: CreateFixedDepositRequest | null;
  setDefaultValues: (values: CreateFixedDepositRequest) => void;
  clearDefaultValues: () => void;

  isAddFDOpen: boolean;
  openAddFD: () => void;
  closeAddFD: () => void;
  toggleAddFD: () => void;
}

export const useAddFDStore = create<IAddFDState>(set => ({
  defaultValues: null,
  setDefaultValues: values => set({ defaultValues: values }),
  clearDefaultValues: () => set({ defaultValues: null }),

  isAddFDOpen: false,
  openAddFD: () => set({ isAddFDOpen: true }),
  closeAddFD: () => set({ isAddFDOpen: false }),
  toggleAddFD: () => set(state => ({ isAddFDOpen: !state.isAddFDOpen })),
}));
