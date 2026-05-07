import React from 'react';
import axios from 'axios';

function Profile({ userAuth }) {
    // Nếu chưa đăng nhập mà cố vào link này thì báo lỗi
    if (!userAuth) return <div className="p-20 text-center">Vui lòng đăng nhập!</div>;

    // 1. Tạo state để lưu danh sách đơn hàng
    const [myOrders, setMyOrders] = React.useState([]);

    // 2. Gọi API lấy đơn hàng khi vào trang
    React.useEffect(() => {
        if (userAuth && userAuth.id) {
        axios.get(`http://localhost:3001/orders?userId=${userAuth.id}`)
            .then(res => {
            setMyOrders(res.data.reverse());
            })
            .catch(err => console.error("Lỗi lấy đơn hàng:", err));
        }
    }, [userAuth]);

    // Giữ nguyên dòng kiểm tra userAuth của bạn ở dưới
    if (!userAuth) return <div className="p-20 text-center text-red-500 font-bold">Vui lòng đăng nhập!</div>;

    return (
        <div className="container mx-auto p-10 flex gap-8">
            {/* Cột trái: Thông tin cá nhân */}
            <div className="w-1/3 bg-white p-6 rounded-2xl shadow-sm border">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-3xl font-bold text-orange-500 mb-4">
                        {userAuth.name.charAt(0)}
                    </div>
                    <h2 className="text-xl font-bold">{userAuth.name}</h2>
                    <p className="text-gray-500 text-sm">{userAuth.email}</p>
                </div>
                <div className="space-y-4 border-t pt-4">
                    <p className="text-sm text-gray-600"><b>Vai trò:</b> Khách hàng thân thiết</p>
                    <p className="text-sm text-gray-600"><b>Ngày gia nhập:</b> 07/05/2026</p>
                </div>
            </div>

        {/* Cột phải: Lịch sử và Truyện */}
            <div className="w-2/3 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                    <h3 className="text-lg font-bold mb-4">📜 Lịch sử mua hàng</h3>
                    
                    <div className="max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                       {myOrders.length > 0 ? (
                        <div className="space-y-4">
                        {myOrders.map((order) => (
                            <div key={order.id} className="p-5 border rounded-2xl mb-4 bg-white shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start border-b pb-3 mb-3">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Mã đơn hàng</p>
                                    <p className="font-mono text-sm text-slate-700">#{order.id.slice(0, 10).toUpperCase()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 font-bold uppercase">Tổng thanh toán</p>
                                    <p className="text-lg font-black text-orange-600">{order.total?.toLocaleString()}đ</p>
                                </div>
                                </div>

                                <div className="space-y-2">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm text-gray-600">
                                    {/* Kiểm tra item.name hay item.title tùy theo db.json của bạn */}
                                    <span>{item.name || item.title} <span className="text-gray-400">x{item.quantity}</span></span>
                                    <span className="font-medium">{item.price?.toLocaleString()}đ</span>
                                    </div>
                                ))}
                                </div>

                                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                                <span className="text-[11px] text-gray-400">{order.date}</span>
                                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-bold uppercase">
                                    {order.status || "Hoàn thành"}
                                </span>
                                </div>
                            </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 italic">Bạn chưa thực hiện đơn hàng nào.</p>
                    )} 
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default Profile;