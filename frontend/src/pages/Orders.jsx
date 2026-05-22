import { useState, useEffect } from 'react'
import { Container, Table, Badge, Button, Collapse, ListGroup } from 'react-bootstrap'
import API from '../api/axios'

const statusColor = {
  pending: 'warning', confirmed: 'primary',
  shipped: 'info', delivered: 'success', cancelled: 'danger'
}

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [open, setOpen] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/orders/').then((res) => {
      setOrders(res.data)
      setLoading(false)
    })
  }, [])

  const toggle = (id) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }))

  if (loading) return <Container className="py-5"><p>Loading orders...</p></Container>

  return (
    <Container className="py-4">
      <h2 className="mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <Table responsive bordered hover>
          <thead className="table-dark">
            <tr>
              <th>Order #</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <>
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>₹{order.total_price}</td>
                  <td>
                    <Badge bg={statusColor[order.status]}>{order.status}</Badge>
                  </td>
                  <td>
                    <Button size="sm" variant="outline-primary"
                      onClick={() => toggle(order.id)}>
                      {open[order.id] ? 'Hide' : 'Show'} Items
                    </Button>
                  </td>
                </tr>
                {open[order.id] && (
                  <tr>
                    <td colSpan={5}>
                      <Collapse in={open[order.id]}>
                        <ListGroup>
                          {order.items.map((item) => (
                            <ListGroup.Item key={item.id}
                              className="d-flex justify-content-between">
                              <span>{item.product_name} × {item.quantity}</span>
                              <span>₹{item.subtotal}</span>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Collapse>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  )
}

export default Orders