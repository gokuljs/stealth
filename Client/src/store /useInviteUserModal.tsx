import { create } from 'zustand';

type InviteUserModalProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useInviteUserModal = create<InviteUserModalProps>((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
}));
