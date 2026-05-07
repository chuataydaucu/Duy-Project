import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CartPage({ cart, setCart, userAuth }) {
    const navigate = useNavigate();
  // Hàm tăng số lượng
  const increaseQty = (id) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  // Hàm giảm số lượng
  const decreaseQty = (id) => {
    setCart(cart.map(item => 
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  // Hàm xóa sản phẩm khỏi giỏ
  const removeFromCart = (id) => {
    if (window.confirm("Bạn muốn xóa sách này khỏi giỏ hàng?")) {
      setCart(cart.filter(item => item.id !== id));
    }
  };

  // Tính tổng tiền
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl mb-5">Giỏ hàng của bạn đang trống</h2>
        <Link to="/" className="bg-orange-500 text-white px-6 py-2 rounded-lg">Quay lại mua sắm</Link>
      </div>
    );
  }

  const handleCheckout = () => {
    // 1. Kiểm tra xem người dùng đã đăng nhập chưa
    if (!userAuth) {
      alert("Vui lòng đăng nhập để tiếp tục thanh toán!");
      navigate('/login'); // Chuyển hướng sang trang login nếu chưa đăng nhập
      return;
    }

    // 2. Nếu đã đăng nhập, chỉ cần chuyển hướng sang trang Checkout
    // Chúng ta không gọi axios.post ở đây nữa mà để trang Checkout xử lý
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
      
      <div className="flex flex-col lg:flex-row gap-10">
        {/* DANH SÁCH SẢN PHẨM */}
        <div className="lg:w-2/3">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-4 bg-white p-4 mb-4 rounded-xl shadow-sm border">
              <img src={item.image} className="w-24 h-32 object-cover rounded" alt={item.name} />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-red-600 font-bold">{item.price.toLocaleString()}đ</p>
                <div className="flex items-center gap-3 mt-3">
                  <button onClick={() => decreaseQty(item.id)} className="px-3 py-1 bg-gray-200 rounded">-</button>
                  <span className="font-bold">{item.quantity}</span>
                  <button onClick={() => increaseQty(item.id)} className="px-3 py-1 bg-gray-200 rounded">+</button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 text-2xl">×</button>
            </div>
          ))}
        </div>

        {/* TỔNG KẾT THANH TOÁN */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-2xl shadow-md border">
            <h2 className="text-xl font-bold mb-4 border-b pb-4">Tóm tắt đơn hàng</h2>
            <div className="flex justify-between mb-2">
              <span>Tạm tính:</span>
              <span>{totalPrice.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between mb-6 font-bold text-lg">
              <span>Tổng cộng:</span>
              <span className="text-red-600">{totalPrice.toLocaleString()}đ</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold mt-4 hover:bg-orange-600 transition-all"
            >
              THANH TOÁN NGAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;