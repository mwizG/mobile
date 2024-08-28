import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../utils/Api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Replacing useHistory with useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await apiPost('/accounts/login/', { username, password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);  // Store role directly// Assuming the backend returns the user's role
      navigate('/dashboard');  // Redirect to the dashboard, role-based redirect will handle the rest
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
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
