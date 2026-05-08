import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CheckoutPage({ cart, setCart, userAuth }) {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const confirmOrder = (e) => {
    e.preventDefault();
    if (!address || !phone) return alert("Vui lòng nhập đầy đủ thông tin!");

    const newOrder = {
      userId: userAuth.id,
      customer: { name: userAuth.name, email: userAuth.email, phone, address },
      items: cart,
      total: totalPrice,
      date: new Date().toLocaleString('vi-VN'),
      status: "Chờ xác nhận"
    };

    axios.post('http://localhost:3001/orders', newOrder)
      .then(() => {
        alert("Đặt hàng thành công!");
        setCart([]); // Xóa giỏ hàng
        navigate('/profile');
      });
  };

  return (
    <div className="container mx-auto p-10 flex gap-10">
      <div className="w-1/2 bg-white p-8 rounded-2xl shadow-sm border">
        <h2 className="text-2xl font-bold mb-6">Thông tin giao hàng</h2>
        <form onSubmit={confirmOrder} className="space-y-4">
          <input 
            type="text" placeholder="Địa chỉ nhận hàng" 
            className="w-full p-3 border rounded-xl"
            value={address} onChange={(e) => setAddress(e.target.value)}
          />
          <input 
            type="text" placeholder="Số điện thoại" 
            className="w-full p-3 border rounded-xl"
            value={phone} onChange={(e) => setPhone(e.target.value)}
          />
          <div className="pt-4">
            <h3 className="font-bold mb-2">Phương thức thanh toán</h3>
            <div className="p-3 border-2 border-orange-500 rounded-xl bg-orange-50 text-orange-700 font-bold">
              🏠 Thanh toán khi nhận hàng (COD)
            </div>
          </div>
          <button className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold mt-6">
            XÁC NHẬN ĐẶT HÀNG
          </button>
        </form>
      </div>

      <div className="w-1/2 bg-gray-50 p-8 rounded-2xl border">
        <h2 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between mb-2 text-sm">
            <span>{item.name || item.title} x{item.quantity || 1}</span>
            <span>{(item.price * (item.quantity || 1)).toLocaleString()}đ</span>
          </div>
        ))}
        <div className="border-t mt-4 pt-4 flex justify-between font-black text-lg">
          <span>Tổng cộng:</span>
          <span className="text-orange-600">{totalPrice.toLocaleString()}đ</span>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;