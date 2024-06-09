import http from '@/lib/http';
import { transformALlDocuments } from '@/transformer/document';
import { Delta } from 'quill/core';

export interface Document {
  id: string; // Unique identifier for the document
  title: string; // Title of the document
  data: Delta;
  lastUpdatedAt: string;
  createdAt: string;
}
export const createDocument = async (title: string): Promise<Document> => {
  const { data } = await http.post('/create-document', { title });
  return transformALlDocuments(data);
};

export const getAllDocuments = async (): Promise<Document[]> => {
  const { data } = await http.get('/allDocuments');
  const modifiedData = data.map((item: Record<string, never>) => transformALlDocuments(item));
  return modifiedData;
};
