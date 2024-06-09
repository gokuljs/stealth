import { create } from 'zustand';

type CreateDocumentModalProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useCreateDocumentModalStore = create<CreateDocumentModalProps>((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
}));
