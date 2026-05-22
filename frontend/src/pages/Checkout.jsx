import { useState } from 'react'
import { Container, Card, Form, Button, Alert, ListGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const [address, setAddress] = useState(user?.address || '')
  const [method, setMethod] = useState('card')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleCheckout = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // Create order
      const orderRes = await API.post('/orders/', {
        shipping_address: address,
        product_ids: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      })
      // Make payment
      await API.post('/payments/', {
        order: orderRes.data.id,
        method,
      })
      clearCart()
      navigate('/orders')
    } catch (err) {
      setError(err.response?.data?.detail || 'Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="py-4" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">Checkout</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Order summary */}
      <Card className="mb-4">
        <Card.Header><strong>Order Summary</strong></Card.Header>
        <ListGroup variant="flush">
          {cart.map((item) => (
            <ListGroup.Item key={item.id} className="d-flex justify-content-between">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
            </ListGroup.Item>
          ))}
          <ListGroup.Item className="d-flex justify-content-between fw-bold">
            <span>Total</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </ListGroup.Item>
        </ListGroup>
      </Card>

      <Form onSubmit={handleCheckout}>
        <Form.Group className="mb-3">
          <Form.Label>Shipping Address</Form.Label>
          <Form.Control as="textarea" rows={3} value={address}
            onChange={(e) => setAddress(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Payment Method</Form.Label>
          <Form.Select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="card">Credit / Debit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank_transfer">Bank Transfer</option>
          </Form.Select>
        </Form.Group>
        <Button type="submit" variant="success" size="lg" className="w-100" disabled={loading}>
          {loading ? 'Placing Order...' : `Pay ₹${cartTotal.toFixed(2)}`}
        </Button>
      </Form>
    </Container>
  )
}

export default Checkout