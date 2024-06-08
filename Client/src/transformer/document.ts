import { Document } from '@/apis/document';

export const transformALlDocuments = (item: Record<string, never>): Document => {
  return {
    id: item._id,
    title: item.title,
    data: item.data,
    createdAt: item.createdAt,
    lastUpdatedAt: item.lastUpdatedAt,
  };
};
