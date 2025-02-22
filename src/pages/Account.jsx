import React from 'react';
import { useNavigate } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '../api/firebase';
import BottomNav from '../components/BottomNav';

const Account = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  return (
    <div>
      <p>Account Page</p>
      <button onClick={handleLogout}>Logout</button>
      <BottomNav />
    </div>
  );
};

export default Account;