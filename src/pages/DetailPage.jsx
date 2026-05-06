import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function DetailPage({ addToCart }) {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/books/${id}`)
      .then(res => setBook(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!book) return <div className="p-20 text-center">Đang tải...</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <Link to="/" className="text-orange-600 mb-5 inline-block">← Quay lại cửa hàng</Link>
      <div className="flex flex-col md:flex-row gap-10 bg-white p-8 rounded-2xl shadow-sm">
        <img src={book.image} className="w-full md:w-80 rounded-lg" alt={book.name} />
        <div>
          <h2 className="text-4xl font-bold mb-2">{book.name}</h2>
          <p className="text-gray-500 text-xl mb-4">Tác giả: {book.author}</p>
          <p className="text-3xl font-bold text-red-600 mb-6">{book.price?.toLocaleString()}đ</p>
          <div className="border-t pt-6">
            <h3 className="font-bold mb-2">Mô tả sách:</h3>
            <p className="text-gray-600 leading-relaxed">{book.description}</p>
          </div>
          <button 
            onClick={() => addToCart(book)}
            className="mt-8 bg-orange-500 text-white px-10 py-3 rounded-full font-bold hover:bg-orange-600 transition-all"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}
export default DetailPage;