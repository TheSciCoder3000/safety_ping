
import './assets/css/App.css';
import { BrowserRouter, Routes, Route } from "react-router";
import Home from './pages/Home';
import Map from './pages/Map';
import Account from './pages/Account';
import Login from './pages/Login.jsx';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/account" element={<Account />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;