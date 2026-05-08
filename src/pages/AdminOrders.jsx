import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get('http://localhost:3001/orders');
    setOrders(res.data);
  };

  // Hàm quan quan trọng nhất: Duyệt đơn & Trừ kho
  const handleApproveOrder = async (order) => {
    try {
      // 1. Kiểm tra kho cho TẤT CẢ sản phẩm trong đơn trước khi duyệt
      for (const item of order.items) {
        const bookRes = await axios.get(`http://localhost:3001/books/${item.id}`);
        if (Number(bookRes.data.stock) < Number(item.quantity)) {
          alert(`Không thể duyệt! Cuốn "${item.name}" hiện chỉ còn ${bookRes.data.stock} trong kho.`);
          return; // Thoát hàm, không duyệt đơn này nữa
        }
      }
      // Cập nhật trạng thái thành "Đã giao" (hoặc "Đã xác nhận")
      await axios.patch(`http://localhost:3001/orders/${order.id}`, { status: "Đã giao" });

      // Trừ kho như cũ
      for (const item of order.items) {
        const bookRes = await axios.get(`http://localhost:3001/books/${item.id}`);
        const currentBook = bookRes.data;
        const newStock = Math.max(0, Number(currentBook.stock) - Number(item.quantity));
        await axios.patch(`http://localhost:3001/books/${item.id}`, { stock: newStock });
      }

      alert("Hệ thống đã trừ kho thành công!");
      fetchOrders(); 
    } catch (err) {
      alert("Lỗi khi xử lý đơn hàng!");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h2>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Mã đơn</th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Sản phẩm</th>
              <th className="p-4">Tổng tiền</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                {/* 1. Mã đơn hàng */}
                <td className="p-4 font-mono text-xs text-gray-500">#{order.id}</td>

                {/* 2. Thông tin khách hàng (Lấy từ order.customer) */}
                <td className="p-4">
                  <p className="font-bold text-gray-800">{order.customer?.name || "Khách vãng lai"}</p>
                  <p className="text-xs text-gray-500">{order.customer?.phone}</p>
                  <p className="text-[10px] text-gray-400 italic">{order.customer?.address}</p>
                </td>

                {/* 3. Danh sách sản phẩm (Lấy từ order.items) */}
                <td className="p-4">
                  <div className="max-h-20 overflow-y-auto space-y-1">
                    {order.items?.map((item, index) => (
                      <div key={index} className="text-xs text-gray-600 flex justify-between gap-4">
                        <span className="truncate max-w-[150px]">{item.name}</span>
                        <span className="font-bold text-gray-400">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </td>

                {/* 4. Tổng tiền (Dùng order.total thay vì totalAmount) */}
                <td className="p-4 font-bold text-red-600">
                  {order.total?.toLocaleString()}đ
                </td>

                {/* 5. Trạng thái (Dùng order.status) */}
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    order.status === "Đã giao" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {order.status || "Chờ xác nhận"}
                  </span>
                </td>

                {/* 6. Hành động Duyệt đơn & Trừ kho */}
                <td className="p-4">
                  {order.status !== "Đã giao" && (
                    <button 
                      onClick={() => handleApproveOrder(order)}
                      className="w-full bg-blue-600 text-white py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Duyệt đơn
                    </button>
                  )}
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