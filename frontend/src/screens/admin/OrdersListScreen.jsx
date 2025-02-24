import React from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGetOrdersQuery } from '../../slices/ordersApiSlice'
import { FaTimes } from 'react-icons/fa'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import Paginacion from '../../components/Paginacion'


const OrdersListScreen = () => {
    const {  pageNumber = '1' } = useParams()
    const { data, isLoading, error } = useGetOrdersQuery(pageNumber)
    if (!isLoading){
    console.log('pagina= ',data?.page)
}

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const formatDateTime = (dateString) => {
        const options =  {
            year: 'numeric',
            month: '2-digit',
            day : '2-digit',
            hour : '2-digit',
            minute : '2-digit',
            hour12 : true
        }

        return new Date(dateString).toLocaleString('en-US', options)
    }

    return isLoading ? <Loader /> : error ? <Message variant={'danger'}>{error}</Message>
        : (
            <div>
                <h1>Orders</h1>

                <Table bordered striped hover responsive  >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {data.orders.map(order => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.user.name}</td>
                            <td>{order.createdAt.substring(0, 10)}</td>
                            <td>${order.itemsPrice}</td>
                            <td>{order.isPaid ? formatDateTime(order.paidAt) : <FaTimes style={{ color: 'red' }}></FaTimes>}</td>
                            <td>{order.isDelivered ? formatDateTime(order.deliveredAt) : <FaTimes style={{color : 'red'}}></FaTimes>}</td>
                            <td><Link as={Link} to={`/order/${order._id}`}><Button variant = 'light' className='btn-sm'>Details</Button></Link></td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

                <Paginacion pages = {data.pages} page={data.page} isAdmin = {true} ruta = 'order'   />
            </div>
        )
}

export default OrdersListScreen