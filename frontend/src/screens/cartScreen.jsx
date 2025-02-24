import { Link, useNavigate } from "react-router-dom"
import { Row, Col, ListGroup, Image, Form, Button, Card, ListGroupItem } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { FaTrash } from "react-icons/fa"
import { set } from "mongoose"
import { addToCart, removeFromCart } from "../slices/cartSlice"
import Message from "../components/Message"

const CartSCreen = () => {
    const { cartItems, itemsPrice } = useSelector((state) => state.cart)
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const addToCartHandler = (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
    };

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const checkoutHandler = () => {
        navigate('/auth?redirect=shipping')
    }

    return (
        <>
            <Row gutter={5} className="my-1">
                <Col lg={8} >
                    <h1 className="fw-bold mb-5">Shopping cart</h1>
                    {cartItems.length === 0 ? (
                        <Message variant="info">
                            Your cart is empty <Link to="/">Go Back</Link>
                        </Message>
                    ) : (
                        <ListGroup variant="flush">
                            {cartItems.map((item) => (
                                <ListGroupItem key={item._id}>
                                    <Row gutter={5} className="my-1">
                                        <Col md={2} lg={2}>
                                            <Image src={item.image} alt='imagen' fluid rounded />
                                        </Col>
                                        <Col lg={4} className="">
                                            <Link to={`/product/${item._id}`}>
                                                <strong className="fs-5 py-2"> {item.name}</strong>
                                            </Link>
                                        </Col>
                                        <Col lg={2}>
                                            <strong className="fs-6 fw-bold">${item.price}</strong>
                                        </Col>
                                        <Col lg={2} className="">
                                            <Form.Control
                                                as="select"
                                                value={item.qty}
                                                onChange={(e) =>
                                                    addToCartHandler(item, Number(e.target.value))
                                                }
                                            >
                                                {[...Array(item.countInStock).keys()].map(x => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                        <Col lg={2}>
                                            <Button type="button" variant="light" onClick={() =>removeFromCartHandler(item._id)}>
                                                <FaTrash />
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    )}

                </Col>
                <Col lg={4} className="mt-4">
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2 className="fw-bold">
                                    Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                                    <span>  </span>Items
                                </h2>
                                <p className="fs-5 my-0">
                                    $ {cartItems
                                        .reduce((acc, item) => acc + item.qty * item.price, 0)
                                        .toFixed(2)}
                                </p>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button type="btn" className="btn btn-block" disabled={cartItems.length === 0} onClick={(e) => checkoutHandler()}>
                                    Proceed To Checkout
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>

            </Row>
        </>
    )
}

export default CartSCreen