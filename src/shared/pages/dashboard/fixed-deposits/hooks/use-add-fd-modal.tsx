// @bhaisaab/shared/pages/dashboard/fixed-deposits/hooks/use-add-fd-modal.tsx
import { create } from "zustand";

interface IAddFDState {
  isAddFDOpen: boolean;
  openAddFD: () => void;
  closeAddFD: () => void;
  toggleAddFD: () => void;
}

export const useAddFDStore = create<IAddFDState>(set => ({
  isAddFDOpen: false,
  openAddFD: () => set({ isAddFDOpen: true }),
  closeAddFD: () => set({ isAddFDOpen: false }),
  toggleAddFD: () => set(state => ({ isAddFDOpen: !state.isAddFDOpen })),
}));
