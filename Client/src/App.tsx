import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import TextEditor from './components/TextEditor/TextEditor';
import { useEffect, useState } from 'react';

function App(): JSX.Element {
  const navigate = useNavigate();
  const isLoggedIn = true;
  const [isLoading, setIsLoading] = useState(true);
  const { docId } = useParams();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      setIsLoading(false); // Set loading to false only if logged in
    }
  }, [isLoggedIn]);

  console.log(docId);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="h-screen w-screen flex">
      <Sidebar />
      <div className="flex flex-col border flex-1">
        <Navbar />
        {docId && <TextEditor id={docId} />}
      </div>
    </div>
  );
}

export default App;
