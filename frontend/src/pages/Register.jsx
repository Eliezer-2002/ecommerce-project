import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import API from '../api/axios'

const Register = () => {
  const [form, setForm] = useState({
    username: '', email: '', password: '', password2: '',
    phone: '', address: '', is_seller: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await API.post('/users/register/', form)
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      const msg = data ? Object.values(data).flat().join(' ') : 'Registration failed.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Card style={{ width: '480px' }} className="p-4 shadow">
        <h3 className="mb-4 text-center">Create Account</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control name="username" value={form.username}
              onChange={handleChange} required placeholder="johndoe" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={form.email}
              onChange={handleChange} required placeholder="john@example.com" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control name="phone" value={form.phone}
              onChange={handleChange} placeholder="9876543210" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control as="textarea" name="address" value={form.address}
              onChange={handleChange} rows={2} placeholder="Your shipping address" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={form.password}
              onChange={handleChange} required placeholder="••••••••" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" name="password2" value={form.password2}
              onChange={handleChange} required placeholder="••••••••" />
          </Form.Group>
          <Form.Check className="mb-3" type="checkbox" name="is_seller"
            label="Register as a Seller" checked={form.is_seller} onChange={handleChange} />
          <Button type="submit" variant="primary" className="w-100" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </Form>
        <p className="text-center mt-3 mb-0">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Card>
    </Container>
  )
}

export default Register