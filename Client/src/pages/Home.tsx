import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import TextEditor from '@/components/TextEditor/TextEditor';
import ModelProvider from '@/providers/ModelProvider';
import { useParams } from 'react-router-dom';

function Home(): JSX.Element {
  const { docId } = useParams();
  return (
    <>
      <div className="h-screen w-screen flex">
        <Sidebar />
        <div className="flex flex-col border flex-1">
          <Navbar />
          {docId && <TextEditor />}
        </div>
      </div>
      <ModelProvider />
    </>
  );
}

export default Home;
