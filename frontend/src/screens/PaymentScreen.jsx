import React, { useEffect, useState } from 'react'
import { Form, Row, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import CheckOutSteps from '../components/CheckOutSteps'
import { savePaymentMethod } from '../slices/cartSlice'

const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('Paypal')
    const cart = useSelector((state) => state.cart)
    const { shippingAddress } = cart
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect((e) => {
        if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
            console.log('shipping address is not defined')
            navigate('/shipping')
        }
    }, [cart, shippingAddress, navigate])
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }
    return (
        <FormContainer>
            <CheckOutSteps step1 step2 step3 />
            <Form onSubmit={submitHandler}>
                <h1 className='my-3 fw-bold'>Payment Method</h1>
                <Form.Group>
                    <Form.Label className='fs-5'>Select Method</Form.Label>
                    <Form.Check
                        type='radio'
                        label='PayPal or credit card'
                        id='PayPal'
                        name='paymentMethod'
                        checked={paymentMethod === 'PayPal'}
                        value='PayPal'
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                </Form.Group>


                <Button type='submit' variant='primary' className='mt-2'>
                    Continue
                </Button>
            </Form>

        </FormContainer>)
}

export default PaymentScreen