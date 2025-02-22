import { BrowserRouter, Routes, Route } from "react-router";
import BottomNav from './components/BottomNav';
import React from 'react';
import Home from './pages/Home';
import Map from './pages/Map';
import Account from './pages/Account';
import Login from './Login.jsx';
import LGU from './LGU.jsx';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Map" element={<Map />} />
          <Route path="/Account" element={<Account />} />
          <Route path="/" element={<Login />} />
          <Route path="/LGU" element={<LGU />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </>
  )
}

export default App;