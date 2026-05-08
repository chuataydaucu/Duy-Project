import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // PHẢI CÓ DÒNG NÀY
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Bọc App ở đây để kích hoạt tính năng chuyển trang */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
)