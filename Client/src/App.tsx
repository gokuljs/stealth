import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import TextEditor from './components/TextEditor/TextEditor';

function App(): JSX.Element {
  return (
    <div className="h-screen w-screen flex">
      <Sidebar />
      <div className="flex flex-col border flex-1">
        <Navbar />
        <TextEditor />
      </div>
    </div>
  );
}

export default App;
