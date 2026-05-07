import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios.get('http://localhost:3001/orders')
      .then(res => setOrders(res.data.reverse())) // Đơn hàng mới nhất hiện lên đầu
      .catch(err => console.error(err));
  };

  // Hàm cập nhật trạng thái đơn hàng
  const updateStatus = (id, newStatus) => {
    axios.patch(`http://localhost:3001/orders/${id}`, { status: newStatus })
      .then(() => {
        alert("Đã cập nhật trạng thái!");
        fetchOrders(); // Load lại danh sách
      });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">📦 Quản lý đơn hàng hệ thống</h2>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800 text-white text-sm">
            <tr>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Sản phẩm</th>
              <th className="p-4">Tổng tiền</th>
              <th className="p-4">Ngày đặt</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-slate-700">{order.customer?.name}</p>
                  <p className="text-xs text-gray-400">{order.customer?.email}</p>
                </td>
                <td className="p-4">
                  <div className="max-w-[200px] text-xs text-gray-600">
                    {order.items?.map(item => `${item.name || item.title} (x${item.quantity})`).join(', ')}
                  </div>
                </td>
                <td className="p-4 font-bold text-orange-600">
                  {order.total?.toLocaleString()}đ
                </td>
                <td className="p-4 text-xs text-gray-500">{order.date}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    order.status === 'Đã giao' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-center space-x-2">
                  <button 
                    onClick={() => updateStatus(order.id, 'Đang giao')}
                    className="text-[11px] bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Giao hàng
                  </button>
                  <button 
                    onClick={() => updateStatus(order.id, 'Đã giao')}
                    className="text-[11px] bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Hoàn tất
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;