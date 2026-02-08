import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Studentpage from './pages/Studentpage';
import Facultypage from './pages/facultypage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Studentpage" element={<Studentpage />} />
        <Route path="/Facultypage" element={<Facultypage />} />
      </Routes>
    </Router>
  );
}

export default App;