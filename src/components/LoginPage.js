import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'manishlodu') {
      localStorage.setItem('isAdmin', 'true');
      onLogin(true);
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="password"
          placeholder="Enter admin password"
          className="w-full p-2 border mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-center mt-4">
  <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
    Login
  </button>
</div>

      </form>
    </div>
  );
};

export default LoginPage;
