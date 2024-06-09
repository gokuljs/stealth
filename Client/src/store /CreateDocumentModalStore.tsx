import { create } from 'zustand';

type createDocumentModalStoreProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useCreateDocumentModalStore = create<createDocumentModalStoreProps>((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
}));
