import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link, Form } from 'react-router-dom'
import { useCreateOrderMutation } from '../slices/ordersApiSlice'
import { Button, Card, ListGroup, ListGroupItem, Row, Col, Image } from 'react-bootstrap'
import CheckOutSteps from '../components/CheckOutSteps'
import Message from '../components/Message'
import { cleanCart } from '../slices/cartSlice'
import Loader from '../components/Loader'
import { toast } from 'react-toastify'

const PlaceOrderScreen = () => {
  const cart = useSelector(state => state.cart)
  const { shippingAddress } = cart
  const { paymentMethod } = cart
  const { cartItems } = cart
  const { taxPrice } = cart
  const { totalPrice } = cart
  const {shippingPrice} = cart
  const { itemsPrice } = cart
  const [createOrder, {isLoading, error}] = useCreateOrderMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()


  useEffect(() => {
    if(!shippingAddress){
      navigate('/shipping')
    }
    else if (!paymentMethod) {
      navigate('/payment')
    }
  }, [paymentMethod, shippingAddress, navigate])

  const placeOrderHandler = async()=> {
    try {
      const order = {
        orderItems : cartItems,
        shippingAddress,
        paymentMethod,
        taxPrice,
        itemsPrice,
        shippingPrice,
        totalPrice
      }

      const res = await createOrder(order).unwrap() // unwrap extrae directamente el payload de la promesa
      dispatch(cleanCart())
      navigate(`/order/${res._id}`)

    }
    catch (error) {
        toast.error(error?.data?.message || error.error)
    }
  }

  return (
    <Row>
      <Col md={8}>
        <CheckOutSteps step1 step2 step3 step4 />
        <ListGroup variant='flush'>
          <ListGroup.Item>
            <h1>Shipping</h1>
            <p>
              <strong>Address: </strong>
              {shippingAddress.address},{' '}
              {shippingAddress.city}, { }
              {console.log(shippingAddress.city + '----')}
              {shippingAddress.postalCode}, { }
              {shippingAddress.country}
            </p>
          </ListGroup.Item>
          <ListGroupItem className=''>
            <h1>Payment Method</h1>
            <p className='my-0'>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </p>
          </ListGroupItem>


          <ListGroupItem>
            <h1>Order Items</h1>
            <ListGroup variant='flush'>
              {cart.cartItems.length === 0 ?
              (
                <Message>Your cart is empty</Message>
              ) :
              (
                  cart.cartItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} className='fluid w-100 rounded' />
                        </Col>
                        <Col>
                          <Link
                            as={Link}
                            to={`/product/${item._id}`}
                            >
                              {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}</Col>
                      </Row>
                    </ListGroup.Item>
                  )
                  )
              )
              }
            </ListGroup>
          </ListGroupItem>
        </ListGroup>
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
              <ListGroupItem>
                <h2>Order Summary</h2>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Items</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                {isLoading && <Loader />}
                {error && <Message variant={'danger'}>eee</Message>}
              </ListGroupItem>
              <ListGroupItem>

              <Button
                className='btn'
                type='button'
                onClick={placeOrderHandler}
                disabled={cartItems.length === 0}>

                Place Order
              </Button>
              </ListGroupItem>

          </ListGroup>

        </Card>
      </Col>
    </Row>
  )
}

export default PlaceOrderScreen