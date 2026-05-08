import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, Filter, Lock, Unlock, ShieldCheck, 
  User, UserCog, History, Key, MoreVertical, Eye
} from 'lucide-react';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:3001/users');
    setUsers(res.data);
  };

  // 1. Chức năng Khóa/Mở khóa (Block/Unblock)
  const toggleUserStatus = async (user) => {
    if (user.role === "Admin") {
      alert("Duy Anh ơi, không thể khóa tài khoản Admin của chính mình đâu!");
      return;
    }
    const newStatus = user.status === "Active" ? "Locked" : "Active";
    await axios.patch(`http://localhost:3001/users/${user.id}`, { status: newStatus });
    fetchUsers();
  };

  // 2. Chức năng Phân quyền (Change Role)
  const changeRole = async (id, newRole) => {
    await axios.patch(`http://localhost:3001/users/${id}`, { role: newRole });
    fetchUsers();
  };

  // Logic Tìm kiếm và Lọc
 // AdminUsers.jsx
    const filteredUsers = users.filter(user => {
    // Thêm kiểm tra && user.name để tránh lỗi undefined
    const name = user.name ? user.name.toLowerCase() : "";
    const email = user.email ? user.email.toLowerCase() : "";
    const username = user.username ? user.username.toLowerCase() : "";

    const matchesSearch = name.includes(searchTerm.toLowerCase()) || 
                            email.includes(searchTerm.toLowerCase()) ||
                            username.includes(searchTerm.toLowerCase());
                            
    const matchesRole = filterRole === "All" || user.role === filterRole;
    
    return matchesSearch && matchesRole;
    });

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header & Welcome */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản trị 👥</h1>
          <p className="text-slate-500 text-sm">Chào Duy Anh, bạn đang quản lý {users.length} người dùng.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
          + Thêm nhân viên mới
        </button>
      </div>

      {/* 3. Bộ lọc và Tìm kiếm */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo tên, email hoặc username..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <select 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 outline-none bg-white appearance-none text-slate-600 font-medium"
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="All">Tất cả vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="Staff">Nhân viên</option>
            <option value="Customer">Khách hàng</option>
          </select>
        </div>
      </div>

      {/* 1. Cấu trúc bảng danh sách */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-black tracking-wider">
            <tr>
              <th className="p-4">Thành viên</th>
              <th className="p-4">Vai trò</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Ngày tham gia</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                {/* Trong AdminUsers.jsx - Phần Render Table */}
                <td className="p-4">
                <div className="flex items-center gap-3">
                    {/* Nếu không có avatar thì hiện ảnh mặc định */}
                    <div>
                    {/* Nếu không có fullName thì hiện username */}
                    <p className="font-bold text-slate-700 text-sm">{user.fullName || user.username}</p>
                    <p className="text-[11px] text-slate-400 italic">{user.email}</p>
                    </div>
                </div>
                </td>
                <td className="p-4">
                {/* Nếu không có role thì mặc định là Customer */}
                <span className="...">
                    {user.role || "Customer"}
                </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                    <span className={`text-xs font-bold ${user.status === 'Active' ? 'text-green-600' : 'text-slate-400'}`}>
                      {user.status === 'Active' ? 'Đang hoạt động' : 'Bị khóa'}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-xs text-slate-500 font-medium">{user.createdAt || "01/01/2026"}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-1">
                    {/* 2. Các chức năng chính (Actions) */}
                    <button onClick={() => toggleUserStatus(user)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-all" title={user.status === 'Active' ? 'Khóa tài khoản' : 'Mở khóa'}>
                      {user.status === 'Active' ? <Lock size={16} /> : <Unlock size={16} className="text-green-600" />}
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-all" title="Reset mật khẩu">
                      <Key size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-all" title="Xem lịch sử mua hàng">
                      <History size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-blue-600 transition-all" title="Chi tiết hồ sơ">
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;