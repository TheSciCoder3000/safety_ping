
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import BottomNav from './components/BottomNav';
import * as React from 'react';
import Home from './pages/Home';
import Map from './pages/Map';
import Account from './pages/Account';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Map" element={<Map />} />
          <Route path="/Account" element={<Account />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </>
  )
}

export default App
