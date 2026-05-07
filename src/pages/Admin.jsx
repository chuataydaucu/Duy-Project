import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Admin() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchBooks();
    fetchCategories(); // Gọi thêm hàm này
  }, []);

  const fetchCategories = () => {
    axios.get('http://localhost:3001/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  };


  const [books, setBooks] = useState([]);
  const savedUser = JSON.parse(localStorage.getItem('user'));

  if (!savedUser || savedUser.role !== 'admin') {
    return <div className="p-20 text-center text-red-500 font-bold">Bạn không có quyền truy cập trang này!</div>;
  }
  // Lấy danh sách sách từ server
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    axios.get('http://localhost:3001/books')
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  };

  // Hàm xóa sách
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa cuốn sách này?")) {
      axios.delete(`http://localhost:3001/books/${id}`)
        .then(() => {
          alert("Xóa thành công!");
          fetchBooks(); // Load lại danh sách sau khi xóa
        });
    }
  };

  // State để quản lý việc ẩn hiện Form và dữ liệu nhập vào
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    author: '', 
    price: '',
    oldPrice: '',
    image: '',
    category: '',
    description: '', 
  });

  // Hàm mở form để Thêm mới
  const openAddForm = () => {
    setEditingBook(null);
    setFormData({ name: '', author: '', price: '', oldPrice: '', image: '', category: '', description: '' });
    setShowForm(true);
  };

  // Hàm mở form để Sửa
  const openEditForm = (book) => {
    setEditingBook(book);
    setFormData({ 
      name: book.name, 
      author: book.author || '', 
      price: book.price, 
      oldPrice: book.oldPrice || '', 
      image: book.image, 
      category: book.category, 
      description: book.description || '' 
    });
    setShowForm(true);
  };

  // Hàm Lưu (Dùng cho cả Thêm và Sửa)
  const handleSave = (e) => {
    e.preventDefault();
    // Chuyển đổi giá về kiểu số để đảm bảo tính toán đúng
    const dataToSave = { 
      ...formData, 
      price: Number(formData.price), 
      oldPrice: Number(formData.oldPrice) 
    };

    if (editingBook) {
      axios.put(`http://localhost:3001/books/${editingBook.id}`, dataToSave)
        .then(() => {
          alert("Cập nhật truyện thành công!");
          setShowForm(false);
          fetchBooks();
        });
    } else {
      axios.post('http://localhost:3001/books', dataToSave)
        .then(() => {
          alert("Thêm truyện mới thành công!");
          setShowForm(false);
          fetchBooks();
        });
    }
  };
  const handleAddCategory = () => {
    const catName = prompt("Nhập tên danh mục mới:");
    if (catName) {
      axios.post('http://localhost:3001/categories', { name: catName })
        .then(() => {
          alert("Đã thêm danh mục mới!");
          fetchCategories(); // Cập nhật lại list cho ô select
        });
    }
  };
  const handleDeleteCategory = (id) => {
  if (window.confirm("Bạn có chắc muốn xóa loại sách này? (Lưu ý: Các truyện thuộc loại này sẽ không bị xóa nhưng sẽ mất nhãn danh mục)")) {
    axios.delete(`http://localhost:3001/categories/${id}`)
      .then(() => {
        alert("Đã xóa danh mục thành công!");
        fetchCategories(); // Load lại danh sách
      });
  }
};

  return (
    <>
    <div className="flex gap-4 mb-8 border-b pb-4">
      <Link to="/admin" className="font-bold text-orange-500 border-b-2 border-orange-500 pb-2">📚 Quản lý sách</Link>
      <Link to="/admin/orders" className="font-bold text-gray-400 hover:text-slate-800 transition-colors">📦 Quản lý đơn hàng</Link>
    </div>

    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý kho sách</h2>
        
        {/* Sửa lại nút Thêm sách mới để gọi hàm openAddForm */}
        {!showForm && (
          <div className="flex justify-center mb-6">
            <button 
              onClick={openAddForm}
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg transition-all"
            >
              + Thêm sách mới
            </button>
          </div>
        )}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-filter backdrop-blur-s flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
                <h3 className="text-2xl font-bold text-slate-800">
                  {editingBook ? "📝 Chỉnh sửa truyện" : "✨ Thêm truyện mới"}
                </h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500 text-2xl">✕</button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Tên truyện</label>
                    <input 
                      type="text" className="w-full p-3 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Tác giả</label>
                    <input 
                      type="text" className="w-full p-3 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Giá bán</label>
                    <input 
                      type="number" className="w-full p-3 bg-gray-50 border rounded-2xl outline-none font-bold text-orange-600"
                      value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Giá gốc</label>
                    <input 
                      type="number" className="w-full p-3 bg-gray-50 border rounded-2xl outline-none text-gray-400"
                      value={formData.oldPrice} onChange={(e) => setFormData({...formData, oldPrice: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Thể loại</label>
                    <select 
                      className="w-full p-3 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required
                    >
                      <option value="">-- Chọn --</option>
                      {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Mô tả chi tiết</label>
                  <textarea 
                    rows="3" className="w-full p-3 bg-gray-50 border rounded-2xl outline-none resize-none focus:ring-2 focus:ring-orange-500"
                    value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Link hình ảnh</label>
                  <input 
                    type="text" className="w-full p-3 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-6 bg-white sticky bottom-0">
                  <button type="submit" className="flex-1 bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all">
                    {editingBook ? "Cập nhật" : "Xác nhận thêm"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-8 bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-200">
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="mt-10 p-6 bg-white rounded-2xl border shadow-sm max-w-md">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            📂 Danh sách các loại sách hiện có
          </h3>
          <div className="space-y-2">
            {categories.map(cat => (
              <div key={cat.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all">
                <span className="text-sm font-medium text-gray-600">{cat.name}</span>
                <button 
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="text-xs text-red-400 hover:text-red-600 font-bold"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden border">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Ảnh</th>
              <th className="p-4">Tên sách</th>
              <th className="p-4">Giá</th>
              <th className="p-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <img src={book.image} alt="" className="w-12 h-16 object-cover rounded" />
                </td>
                <td className="p-4 font-medium">{book.name}</td>
                <td className="p-4 text-orange-600 font-bold">{book.price}đ</td>
                <td className="p-4 space-x-2">
                  <button 
                    onClick={() => openEditForm(book)}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(book.id)}
                    className="text-red-600 font-semibold hover:underline"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}

export default Admin;