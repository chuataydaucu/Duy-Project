import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [user, setUser] = useState({ name: "", email: "", password: "", role: 'customer' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/users', user)
      .then(() => {
        alert("Đăng ký thành công!");
        navigate('/login');
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl shadow-xl border">
      <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Họ tên" className="w-full p-3 border rounded-lg" 
          onChange={e => setUser({...user, name: e.target.value})} required />
        <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" 
          onChange={e => setUser({...user, email: e.target.value})} required />
        <input type="password" placeholder="Mật khẩu" className="w-full p-3 border rounded-lg" 
          onChange={e => setUser({...user, password: e.target.value})} required />
        <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold">Đăng ký</button>
      </form>
    </div>
  );
}
export default Register;