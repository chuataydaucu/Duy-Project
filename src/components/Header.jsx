function Header({ searchTerm, setSearchTerm, cartCount }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
        {/* Logo */}
        <h1 className="text-2xl font-black text-orange-600 tracking-tighter cursor-pointer">
          TAYF<span className="text-slate-800">BOOKS</span>
        </h1>
        
        {/* Search Bar - Thêm mới ở đây */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm sách bạn muốn..." 
              value={searchTerm} // Gắn giá trị từ state
              onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật state khi gõ
              className="..." 
            />
            <span className="absolute right-4 top-2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Navigation & Cart */}
        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer group">
            <span className="text-2xl group-hover:scale-110 inline-block transition-all">🛒</span>
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
              {cartCount}
            </span>
          </div>
          <button className="bg-slate-800 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-orange-600 hover:shadow-lg transition-all active:scale-95">
            Đăng nhập
          </button>
        </div>
      </div>
    </header>
  );
}
export default Header;