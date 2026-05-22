import { Container, Table, Button, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (cart.length === 0) return (
    <Container className="py-5 text-center">
      <h4>Your cart is empty</h4>
      <Button variant="primary" className="mt-3" onClick={() => navigate('/')}>
        Browse Products
      </Button>
    </Container>
  )

  return (
    <Container className="py-4">
      <h2 className="mb-4">Your Cart</h2>
      <Table responsive bordered hover>
        <thead className="table-dark">
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>₹{item.price}</td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <Button size="sm" variant="outline-secondary"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</Button>
                  <span>{item.quantity}</span>
                  <Button size="sm" variant="outline-secondary"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                </div>
              </td>
              <td>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
              <td>
                <Button size="sm" variant="danger"
                  onClick={() => removeFromCart(item.id)}>Remove</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <Button variant="outline-secondary" onClick={clearCart}>Clear Cart</Button>
        <div className="text-end">
          <h5>Total: ₹{cartTotal.toFixed(2)}</h5>
          {!user ? (
            <Alert variant="warning" className="mt-2 mb-0">
              Please <a href="/login">login</a> to checkout
            </Alert>
          ) : (
            <Button variant="success" size="lg" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </Button>
          )}
        </div>
      </div>
    </Container>
  )
}

export default Cart