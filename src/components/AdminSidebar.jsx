import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function AdminSidebar() {
  const location = useLocation();
  const path = location.pathname;

  const menuItems = [
    { name: '🏠 Trang chủ', path: '/admin' },
    { name: '📚 Quản lý sản phẩm', path: '/admin/products' },
    { name: '📂 Quản lý danh mục', path: '/admin/categories' },
    { name: '📦 Quản lý đơn hàng', path: '/admin/orders' },
    { name: '👥 Quản lý người dùng', path: '/admin/users' },
  ];

  return (
    <div className="sidebar">
      <div className="px-6 mb-8">
        <h1 className="text-xl font-black text-orange-500">TAYFBOOKS ADMIN</h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Hệ thống quản trị</p>
      </div>
      
      <nav>
        {menuItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`sidebar-item ${path === item.path ? 'active' : ''}`}
          >
            {item.name}
          </Link>
        ))}
        
        <div className="mt-10 pt-10 border-t border-slate-700">
          <Link to="/" className="sidebar-item hover:text-red-400">
            ↩️ Quay lại cửa hàng
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default AdminSidebar;