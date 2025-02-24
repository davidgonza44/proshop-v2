import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {  Link, useLocation, useNavigate } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import { setCredentials } from '../slices/authSlice'
import { useRegisterMutation } from '../slices/usersApiSlice'
import { Col, ListGroup, ListGroupItem,Form, Row, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'

const RegisterScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [register, { isLoading }] = useRegisterMutation()
    const { userInfo } = useSelector(state => state.auth)
    const {search} = useLocation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

    useEffect(() => {
        if (userInfo) { // Al principio viniendo de cart userINFO esta vacio, cuando me registre, me lleva a redirect
            navigate(redirect)
        }
    }, [userInfo, redirect, navigate])

    const registerHandler = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (password.length < 6){
            toast.error('Password must be at least 6 characters')
            return
        }



        try {
            const res = await register({ name, email, password}).unwrap()
            dispatch(setCredentials({...res})) // userInfo CAMBIA
            navigate(redirect)
            toast.success('Registration successful')
        } catch (error) {
            toast.error(error?.data?.message || error)
        }

    }



    return (
        <FormContainer>
            <h1>Register</h1>
            <Form onSubmit={registerHandler}>
                <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter name'
                        value={name}
                        onChange={(e)=> setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId='email'>
                    <Form.Label>
                        Email Adress
                    </Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId='password'>
                    <Form.Label>
                        Password
                    </Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter password'
                        value= {password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId='confirmPassword'>
                    <Form.Label>
                        Confirm Password
                    </Form.Label>
                    <Form.Control
                    type = 'password'
                    placeholder='Confirm password'
                    value={confirmPassword}
                    onChange={(e)=> setConfirmPassword(e.target.value)}
                    />
                </Form.Group>
                <Button type='submit' variant='primary' className='mt-3 w-100'>
                    Register
                </Button>
            </Form>

            <Row className='py-3'>
                <Col>
                    Already have an account?
                    <Link to={redirect ? `/auth?redirect=${redirect}` : '/register'}>
                        </Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default RegisterScreen