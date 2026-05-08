import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function AdminSidebar() {
  const location = useLocation(); // Lấy đường dẫn hiện tại để làm hiệu ứng Active

  // Hàm kiểm tra xem menu có đang được chọn không
  const isActive = (path) => location.pathname === path ? "bg-orange-600 text-white" : "text-gray-300 hover:bg-slate-700 hover:text-white";

  return (
    <div className="sidebar flex flex-col h-screen bg-slate-800 shadow-xl">
      {/* Phần Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-black text-orange-500 tracking-tighter">
          TAYF<span className="text-white">BOOKS</span>
        </h1>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">
          Hệ thống Quản trị
        </p>
      </div>

      {/* Danh sách Menu */}
      <nav className="flex-1 mt-4 px-3 space-y-1">
        <Link to="/admin/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/admin')}`}>
          <span>🏠</span> <span className="font-medium">Trang chủ</span>
        </Link>
        
        <Link to="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/admin/products')}`}>
          <span>📚</span> <span className="font-medium">Quản lý sản phẩm</span>
        </Link>

        <Link to="/admin/categories" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/admin/categories')}`}>
          <span>📂</span> <span className="font-medium">Quản lý danh mục</span>
        </Link>

        <Link to="/admin/orders" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/admin/orders')}`}>
          <span>📦</span> <span className="font-medium">Quản lý đơn hàng</span>
        </Link>

        <Link to="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/admin/users')}`}>
          <span>👥</span> <span className="font-medium">Quản lý người dùng</span>
        </Link>
      </nav>

      {/* Nút quay lại cửa hàng ở dưới cùng */}
      <div className="p-4 border-t border-slate-700">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-orange-400 transition-colors text-sm">
          <span>⬅️</span> Quay lại cửa hàng
        </Link>
      </div>
    </div>
  );
}

export default AdminSidebar;