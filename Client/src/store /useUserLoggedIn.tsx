import { create } from 'zustand';

type currentActiveDocumentProps = {
  isUserLoggedIn: boolean;
  update: (value: boolean) => void;
};

export const useIsUserLoggedIn = create<currentActiveDocumentProps>((set) => ({
  isUserLoggedIn: false,
  update: (value: boolean) => set({ isUserLoggedIn: value }),
}));
