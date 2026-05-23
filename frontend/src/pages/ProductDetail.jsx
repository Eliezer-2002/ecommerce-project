import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button, Badge, Form, Alert, Card } from 'react-bootstrap'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

const ProductDetail = () => {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [review, setReview] = useState({ rating: 5, comment: '' })
    const [reviewMsg, setReviewMsg] = useState('')
    const [error, setError] = useState('')
    const { addToCart } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        API.get(`/products/${id}/`).then((res) => setProduct(res.data))
    }, [id])

    const handleReview = async (e) => {
        e.preventDefault()
        setReviewMsg('')
        setError('')
        try {
            await API.post(`/products/${id}/reviews/`, review)
            setReviewMsg('Review submitted!')
            const res = await API.get(`/products/${id}/`)
            setProduct(res.data)
        } catch (err) {
            setError(err.response?.data?.detail || 'Could not submit review.')
        }
    }

    if (!product) return <Container className="py-5"><p>Loading...</p></Container>

    return (
        <Container className="py-4">
            <Button variant="link" className="mb-3 ps-0" onClick={() => navigate(-1)}>
                ← Back
            </Button>
            <Row>
                <Col md={5}>
                    {product.image ? (
                        <img src={`${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '')}${product.image}`} alt={product.name}
                            className="img-fluid rounded shadow" />
                    ) : (
                        <div className="bg-secondary rounded d-flex align-items-center justify-content-center"
                            style={{ height: '320px' }}>
                            <span className="text-white fs-4">No Image</span>
                        </div>
                    )}
                </Col>
                <Col md={7}>
                    <h2>{product.name}</h2>
                    <Badge bg="secondary" className="mb-2">{product.category_name}</Badge>
                    <p className="price-tag">₹{product.price}</p>
                    <p>{product.description}</p>
                    <p className="text-muted">
                        Sold by: <strong>{product.seller_email}</strong>
                    </p>
                    <p className={product.stock > 0 ? 'text-success' : 'text-danger'}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </p>
                    <Button variant="primary" size="lg" disabled={product.stock === 0}
                        onClick={() => { addToCart(product); navigate('/cart') }}>
                        Add to Cart
                    </Button>
                </Col>
            </Row>

            {/* Reviews */}
            <hr className="my-4" />
            <h4>Reviews ({product.reviews.length})</h4>
            {product.reviews.length === 0 && <p className="text-muted">No reviews yet.</p>}
            {product.reviews.map((r, i) => (
                <Card key={i} className="review-card mb-3 p-3">
                    <div className="d-flex justify-content-between">
                        <strong>{r.user_email}</strong>
                        <span>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    </div>
                    <p className="mb-0 mt-1">{r.comment}</p>
                </Card>
            ))}

            {/* Add Review */}
            {user && (
                <>
                    <h5 className="mt-4">Leave a Review</h5>
                    {reviewMsg && <Alert variant="success">{reviewMsg}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleReview} style={{ maxWidth: '480px' }}>
                        <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <Form.Select value={review.rating}
                                onChange={(e) => setReview({ ...review, rating: parseInt(e.target.value) })}>
                                {[5, 4, 3, 2, 1].map((n) => (
                                    <option key={n} value={n}>{n} ★</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control as="textarea" rows={3} value={review.comment}
                                onChange={(e) => setReview({ ...review, comment: e.target.value })} />
                        </Form.Group>
                        <Button type="submit" variant="primary">Submit Review</Button>
                    </Form>
                </>
            )}
        </Container>
    )
}

export default ProductDetail