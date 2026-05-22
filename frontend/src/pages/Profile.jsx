import { useState, useEffect } from 'react'
import { Container, Card, Form, Button, Alert, Badge } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

const Profile = () => {
  const { user, login } = useAuth()
  const [form, setForm] = useState({ username: '', phone: '', address: '' })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) setForm({
      username: user.username || '',
      phone: user.phone || '',
      address: user.address || '',
    })
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess('')
    setError('')
    try {
      const res = await API.patch('/users/profile/', form)
      login(res.data,
        localStorage.getItem('access_token'),
        localStorage.getItem('refresh_token'))
      setSuccess('Profile updated successfully!')
    } catch {
      setError('Update failed. Please try again.')
    }
  }

  return (
    <Container className="py-4 d-flex justify-content-center">
      <Card style={{ width: '480px' }} className="p-4 shadow">
        <h3 className="mb-1">My Profile</h3>
        <p className="text-muted mb-4">{user?.email}</p>
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control as="textarea" rows={3} value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Form.Group>
          <Badge bg={user?.is_seller ? 'success' : 'secondary'} className="mb-3 d-block">
            {user?.is_seller ? 'Seller Account' : 'Buyer Account'}
          </Badge>
          <Button type="submit" variant="primary" className="w-100">
            Save Changes
          </Button>
        </Form>
      </Card>
    </Container>
  )
}

export default Profile