import { Document, getAllDocuments } from '@/apis/document';
import { ApiGetAllDocumentsKey } from '@/lib/queryKey';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

const useGetAllDocument = (userEmail: string | null): UseQueryResult<Document[]> => {
  return useQuery({
    queryKey: [ApiGetAllDocumentsKey],
    queryFn: () => getAllDocuments(userEmail),
  });
};

export default useGetAllDocument;
