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
export const createDocument = async (title: string, userEmail: string | null): Promise<Document> => {
  const { data } = await http.post('/create-document', { title, email: userEmail });
  return transformALlDocuments(data);
};

export const getAllDocuments = async (userEmail: string | null): Promise<Document[]> => {
  const { data } = await http.get(`/allDocuments/${userEmail}`);
  const modifiedData = data.map((item: Record<string, never>) => transformALlDocuments(item));
  return modifiedData;
};
