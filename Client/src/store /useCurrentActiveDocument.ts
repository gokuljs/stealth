import { Document } from '@/apis/document';
import { create } from 'zustand';

type currentActiveDocumentProps = {
  data: Document | null;
  update: (data: Document) => void;
};

export const useCurrentActiveDocument = create<currentActiveDocumentProps>((set) => ({
  data: null,
  update: (data: Document) => set({ data }),
}));
