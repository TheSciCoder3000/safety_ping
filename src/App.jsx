import { useState } from 'react';
import './Login.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import LGU from './LGU.jsx';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/LGU" element={<LGU />} />
      </Routes>
    </Router>
  );
}

export default App;