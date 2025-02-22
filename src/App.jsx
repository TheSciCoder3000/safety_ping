import { BrowserRouter, Routes, Route } from "react-router";
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Map from './pages/Map';
import Account from './pages/Account';
import Login from './Login.jsx';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Map" element={<Map />} />
          <Route path="/Account" element={<Account />} />
          <Route path="/" element={<Login />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </>
  )
}

export default App;