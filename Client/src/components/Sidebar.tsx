import { useCreateDocumentModalStore } from '@/store /CreateDocumentModalStore';
import { CirclePlus } from 'lucide-react';

const Sidebar = (): JSX.Element => {
  const { onOpen } = useCreateDocumentModalStore();
  return (
    <aside className="w-[250px] bg-secondary flex flex-col shadow border-r-2 border-stone-100 py-2 px-2 max-h-full overflow-y-auto gap-1">
      <div
        role="button"
        className="flex items-center hover:bg-primary/5 text-muted-foreground font-medium  py-1 pr-3 pl-3 text-sm rounded-sm bg-secondary "
        onClick={onOpen}
      >
        <CirclePlus className="shrink-0 h-[18px] mr-1 text-muted-foreground" />
        Create
      </div>
      <div className="max-h-full flex flex-col gap-1 overflow-y-auto"></div>
    </aside>
  );
};

export default Sidebar;
