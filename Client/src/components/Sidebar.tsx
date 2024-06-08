import { useCreateDocumentModalStore } from '@/store /CreateDocumentModalStore';
import { CirclePlus } from 'lucide-react';
import { Button } from './ui/button';
import useGetAllDocument from '@/queries/useGetAllDocument';
import { useCurrentActiveDocument } from '@/store /useCurrentActiveDocument';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

const Sidebar = (): JSX.Element => {
  const { docId } = useParams();
  const { onOpen } = useCreateDocumentModalStore();
  const { data: allDocuments, isLoading } = useGetAllDocument();
  const { data, update } = useCurrentActiveDocument();
  const navigate = useNavigate();

  useEffect(() => {
    if (data === null) {
      const currentData = allDocuments?.find((item) => item.id === docId);
      currentData && update(currentData);
    }
  }, [docId, data, allDocuments]);
  return (
    <aside className="min-w-[250px] bg-secondary flex flex-col shadow border-r-1 border-stone-100 max-h-full overflow-y-auto gap-y-1">
      <div className="flex justify-center items-center  h-[62px] border-b-2  px-2">
        <Button role="button" className="flex items-center flex-1" onClick={onOpen}>
          <CirclePlus className="h-[18px] mr-1 text-muted-foreground" />
          Create
        </Button>
      </div>
      <div className="max-h-full flex flex-col gap-1 overflow-y-auto px-2 py-2 flex-1 overflow-auto">
        {isLoading && <p>Loading...</p>}
        {allDocuments &&
          allDocuments.length > 0 &&
          allDocuments.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                update(item);
                navigate(`/${item.id}`);
              }}
              className={`text-muted-foreground text-left h-8 flex items-center px-2 py-0 hover:text-neutral-950 rounded-sm cursor-pointer hover:bg-neutral-300 capitalize transition-all duration-100 ease-in-out w-full truncate
                ${data && item.id === data.id && 'bg-neutral-300 text-neutral-900'}
                `}
            >
              {item.title}
            </div>
          ))}
      </div>
    </aside>
  );
};

export default Sidebar;
