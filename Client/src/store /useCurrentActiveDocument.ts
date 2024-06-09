import { Document } from '@/apis/document';
import { create } from 'zustand';

type CurrentActiveDocumentProps = {
  data: Document | null;
  update: (data: Document | null) => void;
};

export const useCurrentActiveDocument = create<CurrentActiveDocumentProps>((set) => ({
  data: null,
  update: (data: Document | null) => {
    console.log(data, 'ind');
    set({ data });
  },
}));
