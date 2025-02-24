import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector, } from 'react-redux'
import { Button, Col, Form, ListGroup, ListGroupItem, Row, Table } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { FaTimes } from 'react-icons/fa'
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice'
import { setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify'
import { useProfileMutation } from '../slices/usersApiSlice'
import { ORDERS_URL } from '../constants'


const ProfileScreen = () => {
    const { userInfo } = useSelector(state => state.auth)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useDispatch()
    const [profile, { isLoading: profileLoading, error: profileError }] = useProfileMutation()
    const { data: myOrders, isLoading, error } = useGetMyOrdersQuery()
    console.log('myOrders', myOrders)
    useEffect(() => {
        setName(userInfo.name)
        setEmail(userInfo.email)
    }, [userInfo, userInfo.name, userInfo.email, dispatch])

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            if (password !== confirmPassword) {
                alert('Passwords do not match')
            }
            else {
                const res = await profile({
                    _id: userInfo._id,
                    name,
                    email,
                    password
                }
                ).unwrap()
                dispatch(setCredentials({ ...res }))
                toast.success('Profile Updated')
            }
        }

        catch (error) {
            toast.error(error?.data?.message || error)
        }

    }
    return (
        <Row>
            <Col md={4}>
                <h1>User Profile</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group className='mb-2'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value())}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='Password'
                            placeholder='Enter password'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type='Password'
                            placeholder='Confirm password'
                            onChange={(e) => setConfirmPassword(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    {profileError && <Message variant='danger'>{profileError}</Message>}
                    {profileLoading ? (<Loader />) : (<Button type='submit' variant='primary'>
                        Update
                    </Button>)}

                </Form>
            </Col>
            <Col>
                <h1 className='mx-2'>My Orders</h1>
                <Table className='table striped hover  responsive'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>

                            {myOrders && myOrders.orders.map(order => (
                                order.user._id === userInfo._id && (
                                    <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>${order.itemsPrice}</td>
                                    <td>{order.isPaid ? order.paidAt.substring(0,10) : (<FaTimes style={{ color: 'red' }} />)}</td>
                                    <td>{order.isDelivered ? (order.deliveredAt.substring(0,10)) : (<FaTimes style={{color:'red'}}></FaTimes>)}</td>
                                    <td><Link as={Link} to={`/order/${order._id}`}>
                                    Details</Link></td>
                            </tr> ) : (null)))}
                    </thead>
                </Table>
            </Col>
        </Row>
    )
}

export default ProfileScreen