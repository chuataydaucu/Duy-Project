import { useEffect, useState } from 'react'
import './App.css'; // Hoặc đường dẫn đúng đến file CSS của bạn
import axios from 'axios'
import Header from './components/Header'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DetailPage from './pages/DetailPage';
import { Link } from 'react-router-dom';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersHistory from './pages/OrdersHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import AdminOrders from './pages/AdminOrders';
import AdminSidebar from './components/AdminSidebar';
import AdminCategories from './pages/AdminCategories';
import AdminProducts from './pages/AdminProducts';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';

function App() {
  // Trong App.jsx
  const [categories, setCategories] = useState(["Tất cả"]); // Khởi tạo với mục "Tất cả" mặc định
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [books, setBooks] = useState([])
  const [orders, setOrders] = useState([]); // Khai báo để React biết 'orders' là gì
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  // Khai báo state để quản lý thông tin người dùng đăng nhập
  const [userAuth, setUserAuth] = useState(null);

  useEffect(() => {
    // 1. Lấy thông tin user từ LocalStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUserAuth(JSON.parse(savedUser));

    // 2. Lấy danh sách sách
    axios.get('http://localhost:3001/books')
      .then(res => setBooks(res.data))
      .catch(err => console.log("Lỗi lấy sách:", err));

    // 3. Lấy danh sách đơn hàng (Dòng này cực quan trọng để Dashboard không bị trắng)
    axios.get('http://localhost:3001/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error("Lỗi lấy đơn hàng:", err));

  }, []);

  useEffect(() => {
    // 4. Lấy danh mục
    axios.get('http://localhost:3001/categories')
      .then(res => {
        const catNames = res.data.map(c => c.name);
        setCategories(["Tất cả", ...catNames]);
      })
      .catch(err => console.error("Lỗi lấy danh mục:", err));
  }, []);
    const addToCart = (book) => {
      // 1. Tìm xem sách này đã có trong giỏ hàng chưa
      const existingItem = cart.find(item => item.id === book.id);
      const currentQtyInCart = existingItem ? existingItem.quantity : 0;

      // 2. Kiểm tra: Tổng số lượng muốn mua có vượt quá kho không?
      if (currentQtyInCart + 1 > Number(book.stock)) {
        alert(`Rất tiếc, trong kho chỉ còn ${book.stock} cuốn. Bạn không thể thêm nữa!`);
        return; // Dừng lại, không thực hiện thêm vào giỏ
      }

      // 3. Nếu còn hàng thì mới tiến hành thêm như bình thường
      if (existingItem) {
        setCart(cart.map(item =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        setCart([...cart, { ...book, quantity: 1 }]);
      }
    };
  
    const handleLogout = () => {
      if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
        // 1. Xóa trong bộ nhớ trình duyệt
        localStorage.removeItem('user');
        
        // 2. Xóa trong State của React để giao diện cập nhật ngay lập tức
        setUserAuth(null);
        
        // 3. Đưa người dùng về trang chủ
        window.location.href = '/'; 
      }
    };
    

  return (
    <Routes>
      {/* ================= PHẦN 1: GIAO DIỆN CLIENT (Người dùng) ================= */}
      {/* Sử dụng /* để bao hàm tất cả các trang không bắt đầu bằng /admin */}
      <Route path="/*" element={
        <div className="min-h-screen bg-gray-50">
          {/* Header chỉ xuất hiện ở các trang Client */}
          <Header 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            cartCount={cart.length}
            userAuth={userAuth}
            handleLogout={handleLogout}
          />
          
          <main className="pt-4"> {/* pt-4 để nội dung không dính sát Header */}
            <Routes>
              {/* Trang chủ (Bản đồ bắt đầu từ đây) */}
              <Route path="/" element={
                <main className="container mx-auto px-4 py-10">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 border-l-8 border-orange-500 pl-4">TRANG CHỦ</h2>
                  </div>

                  {/* Thanh bộ lọc thể loại */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedCategory === cat
                            ? "bg-orange-500 text-white shadow-lg scale-105"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {books
                      .filter((book) => {
                        const matchCategory = selectedCategory === "Tất cả" || book.category === selectedCategory;
                        // Dấu ?. ở đây cực kỳ quan trọng để tránh lỗi toLowerCase
                        const matchSearch = book.name?.toLowerCase().includes(searchTerm.toLowerCase());
                        return matchCategory && matchSearch;
                      })
                      .map((book) => (
                        <div key={book.id} className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                          <div className="relative h-64 overflow-hidden bg-gray-200">
                            <img 
                              src={book.image} 
                              alt={book.name} 
                              className={`w-full h-full object-cover transition-all ${Number(book.stock) <= 0 ? "grayscale opacity-50" : ""}`} 
                            />
                          </div>
                          {Number(book.stock) <= 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                                Hết hàng
                              </span>
                            </div>
                          )}
                          <div className="p-4">
                            <p className="text-xs text-orange-500 font-semibold mb-1">{book.category}</p>
                            <Link to={`/book/${book.id}`}>
                              <h3 className="font-bold text-gray-800 truncate mb-1 hover:text-orange-600 transition-colors cursor-pointer">{book.name}</h3>
                            </Link>
                            <p className="text-xs text-gray-500 mb-3">Tác giả: {book.author || "Đang cập nhật"}</p>
                            <div className="flex items-end gap-2 mb-4">
                              <span className="text-lg font-bold text-red-600">{Number(book.price).toLocaleString('vi-VN')}đ</span>
                              {book.oldPrice && <span className="text-xs text-gray-400 line-through pb-1">{Number(book.oldPrice).toLocaleString('vi-VN')}đ</span>}
                            </div>
                            <button 
                              disabled={book.stock <= 0}
                              onClick={() => addToCart(book)}
                              className={`w-full py-2 rounded-lg mt-4 font-bold ${book.stock <= 0 ? "bg-gray-300 cursor-not-allowed" : "bg-slate-800 text-white hover:bg-orange-600"}`}
                            >
                              {book.stock <= 0 ? "Tạm hết hàng" : "🛒 Thêm vào giỏ"}
                            </button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </main>
              } />

              {/* Các trang Client khác */}
              <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} userAuth={userAuth} />} />
              <Route path="/checkout" element={<CheckoutPage cart={cart} setCart={setCart} userAuth={userAuth} />} />
              <Route path="/profile" element={<Profile userAuth={userAuth} />} />
              <Route path="/login" element={<Login setUserAuth={setUserAuth} />} />
              <Route path="/book/:id" element={<DetailPage addToCart={addToCart} />} />
              <Route path="/my-orders" element={<OrdersHistory />} />
              <Route path="/register" element={<Register />} />
              
            </Routes>
          </main>
        </div>
      } />

      {/* ================= PHẦN 2: GIAO DIỆN ADMIN (Quản trị) ================= */}
      {/* Tách biệt hoàn toàn, có Sidebar riêng, không có Header của Client */}
      <Route path="/admin/*" element={
        <div className="admin-container">
          <AdminSidebar /> {/* Sidebar menu bên trái */}
          <div className="admin-content"> {/* Vùng nội dung bên phải */}
            <Routes>
              <Route 
                path="/" 
                element={<AdminDashboard books={books} orders={orders} categories={categories} />} 
              />
              <Route path="categories" element={<AdminCategories books={books} categories={categories} />} />
              <Route path="products" element={<AdminProducts categories={categories} />} />
              <Route path="/orders" element={<AdminOrders />} />
              <Route path="/dashboard" element={<AdminDashboard books={books} orders={orders} categories={categories}/> }  />
              <Route path="/users" element={<AdminUsers />} />  
            </Routes>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App
