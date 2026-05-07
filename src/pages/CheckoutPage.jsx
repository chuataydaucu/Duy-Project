import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CheckoutPage({ cart, setCart }) {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });
  
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleOrder = (e) => {
    e.preventDefault();
    
    const newOrder = {
      id: Date.now(),
      customer: customer,
      items: cart,
      total: totalPrice,
      date: new Date().toLocaleString(),
      status: "Chờ xác nhận" // Đáp ứng yêu cầu "Cập nhật trạng thái đơn hàng" cho Admin sau này
    };

    // Gửi dữ liệu đơn hàng lên server
    axios.post('http://localhost:3001/orders', newOrder)
      .then(() => {
        alert("Đặt hàng thành công!");
        setCart([]); // Xóa sạch giỏ hàng sau khi mua
        navigate('/'); // Quay về trang chủ
      })
      .catch(err => console.error("Lỗi đặt hàng:", err));
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Thông tin giao hàng</h1>
      <form onSubmit={handleOrder} className="bg-white p-8 rounded-2xl shadow-lg border">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Họ và tên</label>
          <input required type="text" className="w-full p-3 border rounded-lg focus:outline-orange-500"
            onChange={(e) => setCustomer({...customer, name: e.target.value})} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Số điện thoại</label>
          <input required type="tel" className="w-full p-3 border rounded-lg focus:outline-orange-500"
            onChange={(e) => setCustomer({...customer, phone: e.target.value})} />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Địa chỉ nhận hàng</label>
          <textarea required className="w-full p-3 border rounded-lg focus:outline-orange-500" rows="3"
            onChange={(e) => setCustomer({...customer, address: e.target.value})}></textarea>
        </div>
        
        <div className="border-t pt-4 mb-6">
          <p className="flex justify-between text-xl font-bold">
            <span>Tổng thanh toán:</span>
            <span className="text-red-600">{totalPrice.toLocaleString()}đ</span>
          </p>
        </div>

        <button type="submit" className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all">
          XÁC NHẬN ĐẶT HÀNG
        </button>
      </form>
    </div>
  );
}

export default CheckoutPage;