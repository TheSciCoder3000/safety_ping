import { useEffect, useState } from 'react';
import { useAuth } from '../components/contexts/AuthContext';
import '../assets/css/Login.css';
import { useNavigate } from 'react-router';
import { loginUser, registerUser } from '../api/auth';


const Login = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser])

  const navigate = useNavigate();

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      navigate('/');
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
      await registerUser(email, password, {
        email,
        firstname,
        lastname,
        contactNumber
      });

      navigate('/');

    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message);
    }
  };

  return (
    <div className='auth-cont'>
      <video autoPlay muted loop>
        <source src="https://static.pbslearningmedia.org/media/media_files/e29ec3e0-5b82-4322-b681-b9858e6391e1/022a1ec0-23ff-447c-9a4d-c7ff3570f252.mp4" type="video/mp4" />
      </video>
      {showLogin ? (
        <div className='container'>
          <form onSubmit={handleLogin}>
            <h2 className='h2-login'>LOGIN</h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" /><br />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" /><br />
            <button type="submit">Login</button><br />
          </form>
          <h3>Don&apos;t have an account? <a href="#" onClick={toggleForm}>Register</a></h3>
          {/* <h3>LGU Login <Link to="/LGU">Login Here</Link></h3> */}

        </div>
      ) : (
        <div className='container-register'>
          <form onSubmit={handleRegister}>
            <h2>Register</h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" /><br />
            <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="First name" /><br />
            <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Last name" /><br />
            <input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="Telephone/Cellphone Number" /><br />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" /><br />
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Retype Password" /><br />
            <button type="submit">Register</button><br />
          </form>
          <h3>Already have an account? <a href="#" onClick={toggleForm}>Login</a></h3>
        </div>
      )}
    </div>
  );
};

export default Login;