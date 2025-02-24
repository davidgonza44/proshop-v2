import { Button, Col, ListGroup, ListGroupItem, Row, Image, Form, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery, useDeliverOrderMutation } from "../slices/ordersApiSlice";
import { useEffect, useRef } from "react";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { toast } from 'react-toastify'
import React from 'react'
import formatDateTime from "../utils/dateUtils";


const OrderScreen = () => {
    const { id: orderId } = useParams()
    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
    const { data: paypal, isLoading: loadingPaypal, error: errorPaypal } = useGetPayPalClientIdQuery()
    const { userInfo } = useSelector((state) => state.auth)
    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId)
    const [deliverOrder, { isLoading: loadingDelivered }] = useDeliverOrderMutation();

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    console.log('PayPal Status:', {
        isPending,
        loadingPaypal,
        clientId: paypal?.clientId,
        orderPaid: order?.isPaid,
        errorPaypal
    });


    useEffect(() => {
        if (!errorPaypal && !loadingPaypal && paypal.clientId) {
            const loadPaypalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': paypal.clientId,
                        currency: 'USD',
                    },
                });
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
            };
            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadPaypalScript();
                }
            }
        }
    }, [errorPaypal, loadingPaypal, order, paypal, paypalDispatch]);



    const onApproveTest = async () => {
        await payOrder({ orderId, details: { payer: {} } });
        refetch()
        toast.success('Payment successful')

    }

    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                await payOrder({ orderId, details });
                refetch()
                toast.success('Payment successful')

            } catch (error) {
                toast.error(error?.data?.message || error?.message)
            }
        })
    }
    function onError(err) {
        toast.error(err.message)
    }
    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: order.totalPrice
                }
            }]
        }).then((orderId) => {
            return orderId
        })
    }

    const deliverOrderHandler = async () => {
        try {
            const res = await deliverOrder(orderId)
            refetch()
            toast.success('Order delivered')

        } catch (error) {
            toast.error(error?.data?.message || error?.message)
        }
    }

    return isLoading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : <>
        <Row>
            <Col md={8}>
                <h1 className="fw-bold">Order {orderId}</h1>
                <ListGroup variant="flush">
                    <ListGroupItem>
                        <h2 className="">Shipping</h2>
                        <p><strong>Name:</strong> {order.user.name}</p>
                        <p><strong>Email:</strong> {order.user.email}</p>
                        <p><strong>Address: </strong>{order.shippingAddress.address}{', '}{order.shippingAddress.city}{', '}{order.shippingAddress.postalCode}{', '}{
                            order.shippingAddress.country
                        }</p>
                        <Message variant={order.isDelivered ? 'success' : 'danger'}>
                            {order.isDelivered ? `Delivered on ${formatDateTime(order.deliveredAt)}` : 'Not delivered'}
                        </Message>
                    </ListGroupItem>
                    <ListGroupItem>
                        <h2>Payment Method</h2>
                        <p><strong>Method:</strong> {order.paymentMethod}</p>
                        <Message variant={order.isPaid ? 'success' : 'danger'}>
                            {order.isPaid ? `Paid on ${formatDateTime(order.paidAt)}` : 'Not paid'}
                        </Message>
                    </ListGroupItem>
                    <ListGroupItem>
                        <h2>Order Items</h2>
                        {order.orderItems.length === 0 ? <Message variant='info'>Order is empty</Message> :
                            (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroupItem key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`} >
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = ${item.qty * item.price}
                                                </Col>
                                            </Row>
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>

                            )
                        }
                    </ListGroupItem>
                </ListGroup>
            </Col>

            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroupItem>
                            <h2>Order Summary</h2>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col>Items</Col>
                                <Col>${order.itemsPrice}</Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>${order.shippingPrice}</Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col>
                                    Tax
                                </Col>
                                <Col>
                                    ${order.taxPrice}
                                </Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col>
                                    Total
                                </Col>
                                <Col>
                                    ${order.totalPrice}
                                </Col>
                            </Row>
                        </ListGroupItem>
                        
                        {loadingDelivered && <Loader />}


                        {!isPending && paypal?.clientId && order && !order.isPaid && (
                            <ListGroupItem>
                                {loadingPay && <Loader />}
                                {isPending ?
                                    (<Loader />)
                                    :
                                    (
                                        <div>
                                            <div>
                                                <PayPalButtons
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                >
                                                </PayPalButtons>
                                            </div>
                                            <Button
                                                onClick={onApproveTest}
                                                style={{ marginBottom: '10px' }}>
                                                Test Pay Order
                                            </Button>
                                        </div>
                                    )}
                            </ListGroupItem>
                        )}
                        {order.isPaid && userInfo.isAdmin && userInfo && !order.isDelivered && (
                            <ListGroupItem>
                                <Button
                                    type='button'
                                    className='btn-block'
                                    onClick={deliverOrderHandler}
                                >
                                    Mark As Delivered
                                </Button>
                            </ListGroupItem>
                        )}
                    </ListGroup>
                </Card>
            </Col>
        </Row>

    </>





}

export default OrderScreen