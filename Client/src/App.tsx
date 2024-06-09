import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
function App(): JSX.Element {
  const isLoggedIn = true;

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:docId" element={<Home />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;
