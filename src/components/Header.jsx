import { Link } from 'react-router-dom';

function Header({ searchTerm, setSearchTerm, cartCount, userAuth, handleLogout }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
        {/* Logo */}
        <Link to="/">
          <h1 className="text-2xl font-black text-orange-600 tracking-tighter cursor-pointer">
            TAYF<span className="text-slate-800">BOOKS</span>
          </h1>
        </Link>
        
        {/* Search Bar - Thêm mới ở đây */}
        <div className="relative w-full max-w-xl mx-auto">
          {/* Icon kính lúp đặt ở bên trái */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Ô input được bo tròn và đẩy chữ sang phải để tránh icon */}
          <input
            type="text"
            placeholder="Tìm kiếm sách bạn muốn..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Navigation & Cart */}
        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative cursor-pointer group">
            <span className="text-2xl group-hover:scale-110 inline-block transition-all">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          {/* Tìm đến thẻ div chứa các nút điều hướng bên phải */}
            <div className="flex items-center gap-4">
              {/* Chèn logic này vào */}
              {userAuth ? (
                <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                  {/* Nút bấm thông minh dựa trên Role */}
                  <Link 
                    to={userAuth.role === 'admin' ? "/admin" : "/profile"} 
                    className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
                  >
                    Chào, <b className="text-orange-500">{userAuth.username}</b>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-500 text-xs font-bold border-l pl-3 ml-1"
                  >
                    Đăng Xuất
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/register" className="text-sm font-bold text-gray-600 hover:text-orange-500">
                    Đăng ký
                  </Link>
                  <Link to="/login" className="bg-slate-800 text-white px-5 py-2 rounded-full text-sm font-bold shadow-md hover:bg-slate-700 transition-all">
                    Đăng nhập
                  </Link>
                </div>
              )}
            </div>
        </div>
      </div>
    </header>
  );
}
export default Header;