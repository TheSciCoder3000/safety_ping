import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';


const db = getFirestore();
const LGU = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
    }
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
        email,
        firstname,
        lastname,
        contactNumber
        });

        alert('Registration successful');

    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>SafetyPing (LGU LOGIN)</h1>
      {showLogin ? (
        <div>
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <label>Email: </label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" /><br />
            <label>Password: </label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" /><br />
            <button type="submit">Login</button><br />
          </form>
          <h3>Don't have an account? <a href="#" onClick={toggleForm}>Register</a></h3>
          <h3>Not an LGU? <Link to="/">Login</Link></h3>
        </div>
      ) : (
        <div>
          <form onSubmit={handleRegister}>
            <h2>Register</h2>
            <label>Email: </label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" /><br />
            <label>Firstname: </label><input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="Firstname" /><br />
            <label>Lastname: </label><input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Lastname" /><br />
            <label>Contact Number: </label><input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="Telephone/Cellphone Number" /><br />
            <label>Password: </label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" /><br />
            <label>Confirm Password: </label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Retype Password" /><br />
            <button type="submit">Register</button><br />
          </form>
          <h3>Already have an account? <a href="#" onClick={toggleForm}>Login</a></h3>
        </div>
      )}
    </div>
  );
};

export default LGU;