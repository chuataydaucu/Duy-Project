import { useEffect, useState } from 'react'
import axios from 'axios'
import Header from './components/Header'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DetailPage from './pages/DetailPage';
import { Link } from 'react-router-dom';

function App() {
  const categories = ["Tất cả", "Kỹ năng sống", "Văn học", "Kinh tế", "Khoa học"];
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [books, setBooks] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
//chua tay dau cin cho
// maay cin cho
  useEffect(() => {
    // Đổi link từ /stories thành /books
    axios.get('http://localhost:3001/books')
      .then(res => setBooks(res.data))
      .catch(err => console.log(err))
  }, [])
  const addToCart = (book) => {
    // Kiểm tra xem sách đã có trong giỏ chưa
    const existingItem = cart.find(item => item.id === book.id);
    
    if (existingItem) {
      // Nếu có rồi thì tăng số lượng lên 1
      setCart(cart.map(item => 
        item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      // Nếu chưa có thì thêm mới vào mảng và đặt số lượng là 1
      setCart([...cart, { ...book, quantity: 1 }]);
    }
    alert(`Đã thêm "${book.name}" vào giỏ hàng!`);
  };
  return (
    <BrowserRouter>
      {/* [Bản đồ bắt đầu từ đây] */}
      <div className="min-h-screen bg-gray-50">
        {/* [Header nằm ngoài Routes để trang nào cũng thấy nó] */}
        <Header
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          cartCount={cart.length} // Truyền số lượng loại sách trong giỏ
        />
        <Routes> {/* [Đây là nơi quyết định trang nào sẽ hiện ra] */}
          <Route path="/" element={
            <main className="container mx-auto px-4 py-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 border-l-8 border-orange-500 pl-4">
                  Sách mới nổi bật
                </h2>
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

              {/* [Phần grid sách - Từ ảnh image_d8a100.png] */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {books
                  .filter(book => {
                    // Điều kiện 1: Lọc theo thể loại
                    const matchesCategory = selectedCategory === "Tất cả" || book.category === selectedCategory;
                    
                    // Điều kiện 2: Lọc theo tên (không phân biệt chữ hoa chữ thường)
                    const matchesSearch = book.name.toLowerCase().includes(searchTerm.toLowerCase());
                    
                    return matchesCategory && matchesSearch;
                  })
                  .map(book => (
                  <div key={book.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative h-64 overflow-hidden bg-gray-200">
                      <Link to={`/book/${book.id}`}>
                        <img 
                          src={book.image} 
                          alt={book.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer" 
                        />
                      </Link>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-xs text-orange-500 font-semibold mb-1">{book.category}</p>
                      <Link to={`/book/${book.id}`}>
                        <h3 className="font-bold text-gray-800 truncate mb-1 hover:text-orange-600 cursor-pointer transition-colors">
                          {book.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 mb-3">tg: {book.author}</p>
                      
                      <div className="flex items-end gap-2 mb-4">
                        <span className="text-lg font-bold text-red-600">{book.price.toLocaleString()}đ</span>
                        <span className="text-xs text-gray-400 line-through pb-1">{book.oldPrice?.toLocaleString()}đ</span>
                      </div>

                      <button 
                        onClick={() => addToCart(book)} // Gọi hàm khi nhấn nút
                        className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 font-medium"
                      >
                        🛒 Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </main>  
          } />
          {/* [TRANG CHI TIẾT: Khi vào đường dẫn /book/id sẽ hiện trang này] */}
          <Route path="/book/:id" element={<DetailPage addToCart={addToCart} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App