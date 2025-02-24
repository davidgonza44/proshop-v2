import React, { useEffect, useState } from 'react'
import {Form, Row, Col, Button} from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { saveShippingAddress } from '../slices/cartSlice'
import CheckOutSteps from '../components/CheckOutSteps'

const ShippingScreen = () => {
    const cart = useSelector(state => state.cart)
    const {shippingAddress} = cart
    const [address, setAdress] = useState(shippingAddress?.address || '')
    const [city, setCity] = useState(shippingAddress?.city || '')
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '')
    const [country, setCountry] = useState(shippingAddress?.country || '')
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const submitHandler = (e)=>{
        e.preventDefault()
        dispatch(saveShippingAddress({ address, city , postalCode, country }))
        navigate('/payment')
    }

    return (
        < FormContainer   >
            <CheckOutSteps step1 step2/>
            <h1>Shipping</h1>
            <Form onSubmit={submitHandler} className='mb-2'>
                <Form.Group controlId='address' className = 'mb-1'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter adress'
                        value={address}
                        onChange={(e) => setAdress(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className = 'mb-1'>
                    <Form.Label>
                        City
                    </Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter city'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required

                    />
                </Form.Group>
                <Form.Group className = 'mb-1'>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter postal code'
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className = 'mb-1'>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter country'
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required


                    />
                </Form.Group>
                <Button type='submit' variant='primary' className='mt-2 w-100'>
                    Continue
                </Button>

            </Form>
        </FormContainer>
    )
}

export default ShippingScreen