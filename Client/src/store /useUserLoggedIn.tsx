import { create } from 'zustand';

type IsUserLoggedInProps = {
  isUserLoggedIn: boolean;
  update: (value: boolean) => void;
};

export const useIsUserLoggedIn = create<IsUserLoggedInProps>((set) => ({
  isUserLoggedIn: false,
  update: (value: boolean) => set({ isUserLoggedIn: value }),
}));
