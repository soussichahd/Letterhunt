import { Navigate, Routes, Route } from 'react-router-dom';
import Login from './Component/Login';
import Register from './Component/Register';
import LetterHunt from './Component/LetterHunt';
import Sound from './Component/Sound';
function App() {
  return (
    <>
    <Sound />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/game" element={<LetterHunt />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
    </>
  );
}

export default App;
