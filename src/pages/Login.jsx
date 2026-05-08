import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Login({ setUserAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
  e.preventDefault();
  
  // 1. Lấy toàn bộ danh sách users về
  axios.get("http://localhost:3001/users")
    .then(res => {
      const allUsers = res.data;
      
      // 2. Tự tìm kiếm thủ công trong mảng (Loại bỏ dấu cách thừa nếu có)
      const user = allUsers.find(u => 
        u.email.trim() === email.trim() && 
        u.password.toString().trim() === password.toString().trim()
      );
      if (user) {
        // ĐĂNG NHẬP THÀNH CÔNG
        localStorage.setItem('user', JSON.stringify(user));
        setUserAuth(user);
        alert(`Đăng nhập thành công! Chào ${user.fullName || user.username || "bạn"}`);
        
        // Chuyển hướng
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
          // THẤT BẠI
          alert("Email hoặc mật khẩu không khớp với bất kỳ tài khoản nào!");
          console.log("Danh sách user hiện có:", allUsers);
          console.log("Dữ liệu bạn vừa nhập:", { email, password });
        }
      })
      .catch(err => {
        alert("Không kết nối được với Server!");
        console.error(err);
      });
  };

  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl shadow-xl border">
      <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
      <form onSubmit={handleLogin} className="space-y-4"> 
        <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" 
          onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mật khẩu" className="w-full p-3 border rounded-lg" 
          onChange={e => setPassword(e.target.value)} required />
        <button className="w-full bg-slate-800 text-white py-3 rounded-lg font-bold">Đăng nhập</button>
        <div className="mt-4 text-center text-sm text-gray-600">
            <span>Bạn chưa có tài khoản? </span>
            <Link
                to="/register"
                className="text-gray-600 hover:text-orange-500 font-bold transition-colors"
            >
                Đăng ký
            </Link>
        </div>
      </form>
    </div>
  );
}
export default Login;