import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ShoppingBag, BookOpen, Users, DollarSign, AlertCircle } from 'lucide-react'; // Cài lucide-react nếu muốn dùng icon

function AdminDashboard({ books = [], orders = [] }) {
  // 1. Xử lý dữ liệu cho 4 thẻ Stats
  const totalRevenue = orders?.filter(o => o.status === "Đã giao")
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  
  const totalOrders = orders?.length || 0;
  const totalBooks = books?.length || 0;
  const lowStockBooks = books?.filter(b => Number(b.stock) < 5) || [];

  // 2. Dữ liệu giả lập cho biểu đồ (Duy Anh có thể lấy từ orders thật nếu muốn)
  const lineData = [
    { name: 'Thứ 2', revenue: 400000 },
    { name: 'Thứ 3', revenue: 300000 },
    { name: 'Thứ 4', revenue: 500000 },
    { name: 'Thứ 5', revenue: 278000 },
    { name: 'Thứ 6', revenue: 189000 },
    { name: 'Thứ 7', revenue: 239000 },
    { name: 'CN', revenue: 349000 },
  ];

  const pieData = [
    { name: 'Kinh tế', value: 400 },
    { name: 'Manga', value: 300 },
    { name: 'Văn học', value: 300 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      {/* Header Chào mừng */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Chào buổi sáng, Duy Anh! 👋</h1>
        <p className="text-slate-500 text-sm">Chúc bạn một ngày quản lý hiệu quả và bùng nổ doanh số.</p>
      </div>

      {/* 1. Khu vực Thông số tổng quát */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Tổng doanh thu" value={`${totalRevenue.toLocaleString()}đ`} trend="+12%" icon={<DollarSign color="white"/>} color="bg-green-500" />
        <StatCard title="Tổng đơn hàng" value={totalOrders} trend="+5%" icon={<ShoppingBag color="white"/>} color="bg-blue-500" />
        <StatCard title="Tổng số sách" value={totalBooks} trend="Ổn định" icon={<BookOpen color="white"/>} color="bg-orange-500" />
        <StatCard title="Khách hàng mới" value="35" trend="+20%" icon={<Users color="white"/>} color="bg-purple-500" />
      </div>

      {/* 2. Khu vực Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Biểu đồ doanh thu (Cột to) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-4">Doanh thu 7 ngày qua</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ tròn (Cột nhỏ) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-4">Tỷ lệ danh mục</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Bảng đơn hàng & Cảnh báo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Đơn hàng mới nhất */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-700">Đơn hàng mới nhất</h3>
            <button className="text-blue-600 text-sm font-semibold">Xem tất cả</button>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-4">Mã đơn</th>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Tổng tiền</th>
                <th className="p-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="border-b border-slate-50">
                  <td className="p-4 font-mono text-slate-400">#{o.id.slice(0, 8)}</td>
                  <td className="p-4 font-bold">{o.customer?.name}</td>
                  <td className="p-4 font-bold text-slate-700">{o.total?.toLocaleString()}đ</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${o.status === "Đã giao" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
                      {o.status || "Đang chờ"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cảnh báo nhanh */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
            <AlertCircle size={20} className="text-red-500"/> Cảnh báo kho
          </h3>
          <div className="space-y-4">
            {lowStockBooks.map(book => (
              <div key={book.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                <span className="text-sm font-bold text-slate-700 truncate w-32">{book.name}</span>
                <span className="text-xs font-black text-red-600 bg-white px-2 py-1 rounded-lg shadow-sm">Còn: {book.stock}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component Thẻ thông số (Helper Component)
function StatCard({ title, value, trend, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black text-slate-800 mt-1">{value}</p>
        <p className={`text-[10px] mt-1 font-bold ${trend.includes('+') ? 'text-green-500' : 'text-slate-400'}`}>{trend}</p>
      </div>
      <div className={`p-3 rounded-xl ${color} shadow-lg shadow-${color.split('-')[1]}-200`}>
        {icon}
      </div>
    </div>
  );
}

export default AdminDashboard;