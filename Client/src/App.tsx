import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import useUserLoggedInDetails from './hooks/useUserLoggedInDetails';
function App(): JSX.Element {
  const { isLoggedIn } = useUserLoggedInDetails();
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/login" replace />} />{' '}
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:docId" element={<Home />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/signUp" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;
