import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiPost } from '../utils/Api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await apiPost('/accounts/login/', { username, password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);  // Assuming the backend returns the user's role within the user object

      // Redirect based on role
      if (response.user.role === 'caregiver') {
        navigate('/caregiver/dashboard');
      } else if (response.user.role === 'care_seeker') {
        navigate('/care-seeker/dashboard');
      } else {
        navigate('/');  // If the role is unknown, redirect to the homepage
        setError('Unknown role, redirecting to homepage.');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>

      {/* Add register link */}
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
