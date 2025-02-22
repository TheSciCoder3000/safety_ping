
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
          <Route path="/0" element={<Home />} />
          <Route path="/1" element={<Map />} />
          <Route path="/2" element={<Account />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </>
  )
}

export default App
