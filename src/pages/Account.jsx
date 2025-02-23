import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { signOut, updateProfile, updatePassword } from 'firebase/auth';
import { auth, db } from '../api/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import BottomNav from '../components/BottomNav';
import Avatar from '@mui/material/Avatar';
import '../assets/css/Account.css';

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [profileFormClass, setProfileFormClass] = useState('profile-form');

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

  const handleEditClick = () => {
    setProfileFormClass('profile-form show'); // Slide down animation
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setProfileFormClass('profile-form hide'); // Slide up animation
    setTimeout(() => {
      setIsEditing(false); // Hide after animation completes
    }, 500);
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
      handleCancelClick();
    } catch (error) {
      console.error('Error updating profile: ', error);
      alert('Error updating profile');
    }
  };

  return (
    <div className="account-container">
      <Avatar alt="Profile Picture" src={user && user.profilePicture} sx={{ width: 100, height: 100 }} />
      {user && <h1>Welcome, {user.firstname}</h1>}
      {!isEditing ? (
        <button onClick={handleEditClick} className="edit-button">Edit Profile</button>
      ) : (
        <>
          <form onSubmit={handleUpdateProfile} className={profileFormClass}>
            <label className='labelText'>
              Firstname:
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </label>
            <label className='labelText'>
              Lastname:
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </label>
            <button type="submit" className='submit-button'>Update Profile</button>
            <button type="button" onClick={handleCancelClick} className="cancel-button">Cancel</button>
          </form>
        </>
      )}
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <BottomNav />
    </div>
  );
};

export default Account;
