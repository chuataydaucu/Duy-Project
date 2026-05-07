import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OrdersHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Lấy danh sách đơn hàng đã lưu trong db.json
    axios.get('http://localhost:3001/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error("Lỗi lấy lịch sử đơn hàng:", err));
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 italic text-slate-800 border-l-4 border-orange-500 pl-4">
        Lịch sử mua hàng của bạn
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4 border-b pb-4">
                <div>
                  <p className="font-bold text-lg text-slate-700">Mã đơn: #{order.id}</p>
                  <p className="text-sm text-gray-400">{order.date}</p>
                </div>
                <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                  order.status === 'Chờ xác nhận' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {order.status}
                </span>
              </div>
              
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between text-gray-600">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>{(item.price * item.quantity).toLocaleString()}đ</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t flex justify-between font-bold text-xl text-red-600">
                <span>Tổng cộng:</span>
                <span>{order.total.toLocaleString()}đ</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersHistory;