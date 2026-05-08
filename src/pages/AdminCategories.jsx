import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminCategories({ books }) {
  // ĐÂY LÀ DÒNG QUAN TRỌNG: Khai báo biến để chứa danh mục
  const [realCategories, setRealCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ name: "" });

  // Hàm lấy dữ liệu từ server
  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:3001/categories');
      setRealCategories(res.data);
    } catch (err) {
      console.error("Không lấy được dữ liệu:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Hàm xóa dùng ID thật
  const handleDelete = async (id) => {
    if (window.confirm("Duy Anh chắc chắn muốn xóa chứ?")) {
      try {
        await axios.delete(`http://localhost:3001/categories/${id}`);
        alert("Xóa thành công!");
        fetchData(); // Tải lại bảng ngay lập tức
      } catch (err) {
        alert("Lỗi xóa: ID không tồn tại trên server.");
      }
    }
  };
  const handleSave = async () => {
    if (!currentCategory.name.trim()) {
        alert("Tên danh mục không được để trống!");
        return;
    }

    try {
        if (currentCategory.id) {
        // 1. Logic SỬA: Dùng axios.put để ghi đè dữ liệu cũ
        await axios.put(`http://localhost:3001/categories/${currentCategory.id}`, {
            name: currentCategory.name
        });
        alert("Cập nhật danh mục thành công!");
        } else {
        // 2. Logic THÊM: Dùng axios.post để tạo mới
        await axios.post('http://localhost:3001/categories', {
            name: currentCategory.name
        });
        alert("Thêm danh mục mới thành công!");
        }

        setIsModalOpen(false); // Đóng Modal
        fetchData(); // Tải lại bảng dữ liệu ngay lập tức
    } catch (err) {
        console.error("Lỗi khi lưu:", err);
        alert("Có lỗi xảy ra, hãy kiểm tra lại server nhé!");
    }
    };
  const openModal = (cat = { name: "" }) => {
    setCurrentCategory(cat);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4">
      {/* ... Phần tiêu đề và nút Thêm giữ nguyên ... */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold border-l-4 border-orange-500 pl-4">Quản lý danh mục</h2>
        <button onClick={() => openModal()} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold ">
          + Thêm mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4">STT</th>
              <th className="px-6 py-4">Tên danh mục</th>
              <th className="px-6 py-4 text-center">Số lượng</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {realCategories.map((cat, index) => (
              <tr key={cat.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">#{index + 1}</td>
                <td className="px-6 py-4 font-bold">{cat.name}</td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                    {books.filter(b => b.category === cat.name).length} Cuốn
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => openModal(cat)} className="text-blue-500 hover:scale-120 shadow-xl">✏️</button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-500  hover:scale-120 shadow-xl">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL (Hiện ra khi bấm Thêm/Sửa) --- */}
    {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
            {/* CHỖ NÀY: Thay thẻ div bên dưới bằng thẻ form */}
            <form 
            onSubmit={(e) => {
                e.preventDefault(); // Ngăn trang web bị load lại khi nhấn Enter
                handleSave();       // Gọi hàm lưu của Duy Anh
            }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
            >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                {currentCategory.id ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                </h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400">&times;</button>
            </div>
            
            <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục</label>
                <input 
                    autoFocus // Tự động nhảy con trỏ chuột vào đây khi mở Modal
                    type="text" 
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Ví dụ: Sách Văn Học"
                    value={currentCategory.name}
                    onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                />
                </div>
                
                <div className="flex gap-3 mt-8">
                <button 
                    type="button" // Nút Hủy phải để type="button" để không bị tính là lệnh Submit
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-100 py-2 rounded-lg"
                >
                    Hủy bỏ
                </button>
                <button 
                    type="submit" // Nút Lưu để type="submit" để nhận lệnh Enter
                    className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-bold"
                >
                    Lưu dữ liệu
                </button>
                </div>
            </div>
            </form>
        </div>
        )}
    </div>
  );
}

export default AdminCategories;