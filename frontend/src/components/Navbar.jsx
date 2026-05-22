import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const AppNavbar = () => {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">🛒 ShopDjango</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {user && <Nav.Link as={Link} to="/orders">My Orders</Nav.Link>}
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/cart">
              Cart {cartCount > 0 && (
                <Badge bg="danger" className="cart-badge">{cartCount}</Badge>
              )}
            </Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to="/profile">{user.username}</Nav.Link>
                <Button variant="outline-light" size="sm" onClick={handleLogout} className="ms-2">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar