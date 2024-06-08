import http from '@/lib/http';

export interface Document {
  id: number; // Unique identifier for the document
  title: string; // Title of the document
}
export const createDocument = async (title: string): Promise<Document> => {
  const { data } = await http.post('/create-document', { title });
  console.log({ data });
  return data;
};
