import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { signOut, updateProfile, updatePassword } from 'firebase/auth';
import { auth, db } from '../api/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import BottomNav from '../components/BottomNav';
import '../assets/css/Account.css';

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser(userData);
        setFirstname(userData.firstname);
        setLastname(userData.lastname);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        firstname,
        lastname
      });
      await updateProfile(auth.currentUser, {
        displayName: `${firstname} ${lastname}`
      });
      alert('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile: ', error);
      alert('Error updating profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(auth.currentUser, newPassword);
      alert('Password updated successfully');
      setNewPassword('');
      setIsChangingPassword(false);
    } catch (error) {
      console.error('Error updating password: ', error);
      alert('Error updating password');
    }
  };

  return (
    <div className="account-container">
      <p>Account Page</p>
      {user && <h1>Welcome, {user.firstname}</h1>}
      {!isEditing ? (
        <button onClick={() => setIsEditing(true)} className="edit-button">Edit Profile</button>
      ) : (
        <>
          <form onSubmit={handleUpdateProfile} className="profile-form">
            <label>
              Firstname:
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </label>
            <label>
              Lastname:
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </label>
            <button type="submit" className='submit-button'>Update Profile</button>
            <button type="button" onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
          </form>
          {!isChangingPassword ? (
            <button onClick={() => setIsChangingPassword(true)} className="change-password-button">Change Password</button>
          ) : (
            <form onSubmit={handleChangePassword} className="password-form">
              <label>
                New Password:
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </label>
              <button type="submit" className='submit-button'>Update Password</button>
              <button type="button" onClick={() => setIsChangingPassword(false)} className="cancel-button">Cancel</button>
            </form>
          )}
        </>
      )}
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <BottomNav />
    </div>
  );
};

export default Account;