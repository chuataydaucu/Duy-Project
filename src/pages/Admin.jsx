import React from 'react';

function Admin() {
  return (
    <div className="container mx-auto p-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Trang Quản Trị Hệ Thống</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-orange-100 rounded-xl shadow-sm border border-orange-200">
          <h3 className="font-bold text-orange-700">Tổng số sách</h3>
          <p className="text-2xl font-black">24</p>
        </div>
        <div className="p-6 bg-blue-100 rounded-xl shadow-sm border border-blue-200">
          <h3 className="font-bold text-blue-700">Đơn hàng mới</h3>
          <p className="text-2xl font-black">5</p>
        </div>
        <div className="p-6 bg-green-100 rounded-xl shadow-sm border border-green-200">
          <h3 className="font-bold text-green-700">Doanh thu</h3>
          <p className="text-2xl font-black">1.200k</p>
        </div>
      </div>
      <p className="mt-10 text-gray-500 italic text-sm">Đang tải dữ liệu quản lý...</p>
    </div>
  );
}

export default Admin;