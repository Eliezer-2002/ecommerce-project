import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppNavbar from './components/Navbar'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Orders from './pages/Orders'

const App = () => {
  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart"        element={<Cart />} />
        <Route path="/checkout"    element={<Checkout />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/profile"     element={<Profile />} />
        <Route path="/orders"      element={<Orders />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App