import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import API from '../api/axios'

const Home = () => {
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState('')
    const [ordering, setOrdering] = useState('')
    const [loading, setLoading] = useState(true)
    const { addToCart } = useCart()
    const navigate = useNavigate()

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (search) params.append('search', search)
            if (ordering) params.append('ordering', ordering)
            const res = await API.get(`/products/?${params.toString()}`)
            setProducts(res.data)
        } catch {
            console.error('Failed to fetch products')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchProducts() }, [ordering])

    const handleSearch = (e) => {
        e.preventDefault()
        fetchProducts()
    }

    return (
        <Container className="py-4">
            <h2 className="mb-4">All Products</h2>

            {/* Search + Filter bar */}
            <Row className="mb-4">
                <Col md={7}>
                    <Form onSubmit={handleSearch}>
                        <InputGroup>
                            <Form.Control placeholder="Search products..."
                                value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button type="submit" variant="primary">Search</Button>
                        </InputGroup>
                    </Form>
                </Col>
                <Col md={3}>
                    <Form.Select value={ordering} onChange={(e) => setOrdering(e.target.value)}>
                        <option value="">Sort by</option>
                        <option value="price">Price: Low to High</option>
                        <option value="-price">Price: High to Low</option>
                        <option value="-created_at">Newest First</option>
                    </Form.Select>
                </Col>
            </Row>

            {/* Product Grid */}
            {loading ? (
                <p>Loading products...</p>
            ) : products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {products.map((product) => (
                        <Col key={product.id}>
                            <Card className="product-card">
                                {product.image ? (
                                    <Card.Img variant="top" src={`${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '')}${product.image}`}
                                        style={{ height: '180px', objectFit: 'cover' }} />
                                ) : (
                                    <div className="bg-secondary d-flex align-items-center justify-content-center"
                                        style={{ height: '180px' }}>
                                        <span className="text-white">No Image</span>
                                    </div>
                                )}
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title className="fs-6">{product.name}</Card.Title>
                                    <Badge bg="secondary" className="mb-2 align-self-start">
                                        {product.category_name}
                                    </Badge>
                                    <p className="price-tag mb-2">₹{product.price}</p>
                                    <p className="text-muted small mb-3">
                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                    </p>
                                    <div className="mt-auto d-flex gap-2">
                                        <Button variant="outline-primary" size="sm"
                                            onClick={() => navigate(`/products/${product.id}`)}>
                                            Details
                                        </Button>
                                        <Button variant="primary" size="sm"
                                            disabled={product.stock === 0}
                                            onClick={() => addToCart(product)}>
                                            Add to Cart
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    )
}

export default Home