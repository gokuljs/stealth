import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import TextEditor from '@/components/TextEditor/TextEditor';
import { Button } from '@/components/ui/button';
import ModelProvider from '@/providers/ModelProvider';
import { useCreateDocumentModalStore } from '@/store /CreateDocumentModalStore';
import { useParams } from 'react-router-dom';

function Home(): JSX.Element {
  const { docId } = useParams();
  const { onOpen } = useCreateDocumentModalStore();

  return (
    <>
      <div className="h-screen w-screen flex">
        <Sidebar />
        <div className="flex flex-col border flex-1">
          <Navbar />
          {docId ? (
            <TextEditor />
          ) : (
            <div className="flex items-center justify-center flex-col h-full w-full gap-4">
              <div className="border rounded-full p-5 bg-stone-900">
                <img src="/create.svg" alt="create" className="h-[180px]" />
              </div>
              <Button onClick={onOpen}>Create New Document</Button>
            </div>
          )}
        </div>
      </div>
      <ModelProvider />
    </>
  );
}

export default Home;
