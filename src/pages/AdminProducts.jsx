import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminProducts({ categories }) {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("Tất cả");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ 
    name: "", price: "", stock: "", category: categories[1], image: "" ,author: "",oldPrice: "", description: ""
    });
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
        const res = await axios.get('http://localhost:3001/books');
        setProducts(res.data);
        } catch (err) {
        console.error("Lỗi lấy danh sách sách:", err);
        }
    };

    // Logic bộ lọc: Kết hợp cả tìm kiếm tên và lọc theo danh mục
    const filteredProducts = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()); // Thêm dấu ?. ở đây
    const matchCat = filterCategory === "Tất cả" || p.category === filterCategory;
    return matchSearch && matchCat;
    });
    // Hàm Lưu sách
    const handleSaveProduct = async () => {
        const dataToSave = {
            ...currentProduct,
            // Đảm bảo các trường này luôn là số để không bị lỗi font/toLocaleString
            price: Number(currentProduct.price),
            oldPrice: currentProduct.oldPrice ? Number(currentProduct.oldPrice) : null,
            stock: Number(currentProduct.stock),
            author: currentProduct.author || "Chưa rõ",
            description: currentProduct.description || ""
        };

        try {
            if (currentProduct.id) {
            await axios.put(`http://localhost:3001/books/${currentProduct.id}`, dataToSave);
            } else {
            await axios.post('http://localhost:3001/books', dataToSave);
            }
            setIsModalOpen(false);
            fetchProducts(); // Tải lại bảng để thấy cuốn mới hiện lên
            alert("Thêm thành công rồi !");
        } catch (err) {
            alert("Lỗi rồi nhé!");
        }
    };
    const handleDeleteProduct = async (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa cuốn sách này không?")) {
            try {
            await axios.delete(`http://localhost:3001/books/${id}`);
            alert("Xóa thành công!");
            fetchProducts(); // Tải lại danh sách
            } catch (err) {
            alert("Lỗi khi xóa sách!");
            }
        }
    };
    return (
        <div className="p-2">
        <div className="flex justify-between items-center mb-8">
            <div>
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-orange-500 pl-4">Quản lý sản phẩm</h2>
            <p className="text-gray-500 text-sm ml-4 mt-1">Tổng cộng: {products.length} đầu sách</p>
            </div>
            <button 
                onClick={() => {
                    setCurrentProduct({ name: "", price: "", stock: "", category: categories[1], image: "", author: "", oldPrice: "", description: "" });
                    setIsModalOpen(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-bold shadow-md"
                >
                + Thêm sách mới
            </button>
        </div>

        {/* --- BỘ LỌC (FILTER) --- */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4">
            <div className="flex-1 relative">
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            <input 
                type="text"
                placeholder="Tìm tên sách..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
            <select 
            className="border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            >
            {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
            ))}
            </select>
        </div>

        {/* --- DANH SÁCH BẢNG --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-gray-600 text-sm uppercase">
                <th className="px-6 py-4 font-semibold">Sản phẩm</th>
                <th className="px-6 py-4 font-semibold text-center">Danh mục</th>
                <th className="px-6 py-4 font-semibold text-center">Giá bán</th>
                <th className="px-6 py-4 font-semibold text-center">Kho</th>
                <th className="px-6 py-4 font-semibold text-right">Hành động</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                        <img src={p.image} alt={p.name} className="w-12 h-16 object-cover rounded shadow-sm" />
                        <div>
                        <p className="font-bold text-gray-800 line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-400">ID: #{p.id}</p>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                    <span className="text-sm bg-gray-100 px-3 py-1 rounded-md text-gray-600">
                        {p.category}
                    </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-orange-600">
                    {Number(p.price).toLocaleString()}đ
                    </td>
                    <td className="px-6 py-4 text-center">
                    {/* CẢNH BÁO TỒN KHO: Nếu < 5 thì chữ đỏ, đậm */}
                    <span className={`font-bold ${Number(p.stock) < 5 ? "text-red-500 animate-pulse" : "text-gray-600"}`}>
                        {p.stock}
                    </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                    <button 
                        onClick={() => {
                            setCurrentProduct(p); // Đổ dữ liệu của cuốn sách p vào Modal
                            setIsModalOpen(true);
                        }}
                        className="text-blue-500 hover:scale-120 transition-transform"
                        >
                        ✏️
                    </button>
                    <button 
                        onClick={() => handleDeleteProduct(p.id)} // <--- Gọi hàm xóa và truyền ID của cuốn sách p vào
                        className="text-red-500 hover:scale-120 transition-transform"
                        title="Xóa sản phẩm"
                    >
                        🗑️
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            {filteredProducts.length === 0 && (
            <div className="p-10 text-center text-gray-400 italic">Không tìm thấy cuốn sách nào khớp với bộ lọc...</div>
            )}
        </div>
        {isModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                <div className="bg-white rounded-2xl w-full max-w-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
                    {currentProduct.id ? "✏️ Chỉnh sửa sách" : "📚 Thêm sách mới"}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Tên sách - Chiếm 2 cột */}
                    <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tên sách</label>
                    <input 
                        className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        placeholder="Ví dụ: Đắc Nhân Tâm"
                        value={currentProduct.name} 
                        onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} 
                    />
                    </div>

                    {/* Tác giả - Mới thêm */}
                    <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tác giả</label>
                    <input 
                        className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Tên tác giả..."
                        value={currentProduct.author} 
                        onChange={e => setCurrentProduct({...currentProduct, author: e.target.value})} 
                    />
                    </div>

                    {/* Danh mục */}
                    <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Danh mục</label>
                    <select 
                        className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-orange-500"
                        value={currentProduct.category} 
                        onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
                    >
                        {categories.filter(c => c !== "Tất cả").map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    </div>

                    {/* Giá bán */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Giá bán hiện tại (đ)</label>
                        <input 
                        type="number"
                        min="0"
                        className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-orange-500"
                        value={currentProduct.price} 
                        onChange={e => setCurrentProduct({...currentProduct, price: e.target.value})} 
                        />
                    </div>

                    {/* Giá cũ (Gạch mờ) - MỚI THÊM */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Giá cũ - chưa giảm (đ)</label>
                        <input 
                        type="number"
                        min="0"
                        placeholder="Ví dụ: 200000"
                        className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-gray-400 bg-gray-50"
                        value={currentProduct.oldPrice || ""} 
                        onChange={e => setCurrentProduct({...currentProduct, oldPrice: e.target.value})} 
                        />
                    </div>

                    {/* Số lượng */}
                    <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Số lượng kho</label>
                    <input 
                        type="number"
                        className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-orange-500"
                        value={currentProduct.stock} 
                        onChange={e => setCurrentProduct({...currentProduct, stock: e.target.value})} 
                    />
                    </div>
                    
                    <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Mô tả chi tiết</label>
                    <textarea 
                        rows="4"
                        className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none"
                        placeholder="Nhập tóm tắt nội dung cuốn sách tại đây..."
                        value={currentProduct.description || ""} 
                        onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} 
                    />
                    </div>

                    {/* Link ảnh - Chiếm 2 cột */}
                    <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Link ảnh bìa (URL)</label>
                    <input 
                        className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="https://..."
                        value={currentProduct.image} 
                        onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})} 
                    />
                    </div>
                </div>

                <div className="flex gap-4 mt-8">
                    <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                    Hủy bỏ
                    </button>
                    <button 
                    onClick={handleSaveProduct} 
                    className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all"
                    >
                    Lưu thông tin
                    </button>
                </div>
                </div>
            </div>
            )}
    </div>
    );
}

export default AdminProducts;