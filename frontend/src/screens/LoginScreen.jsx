import { useState, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useDispatch, useSelector} from "react-redux";
import { Link, useNavigate, useLocation} from "react-router-dom";
import FormContainer from "../components/FormContainer";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";


const LoginScreen = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {userInfo} = useSelector((state) => state.auth)
    const [login, { isLoading }] = useLoginMutation()

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {search} = useLocation()

    const sp = new URLSearchParams(search)
    const redirect = sp.get("redirect") || "/"
    // /auth?redirect=shipping => redirect = shipping
    useEffect(() => {
        if (userInfo){
            navigate(redirect) // si estoy logueado me lleva a shipping, si no, a home
        }
    }, [userInfo, redirect, navigate])

    const submitLoginHandler = async (e) => {
        try {
            e.preventDefault()
            const res = await login({ email, password }).unwrap() // devuelve una promesa y  unwrap() devuelve el valor util
            dispatch(setCredentials({...res}))
            navigate("/")
        } catch (error) {
            toast.error(error?.data.message || error)
        }
    }

    return (
        <FormContainer>
            <h1 className="">Sign In</h1>
            <Form onSubmit={submitLoginHandler}>
                <Form.Group controlId="email" className="my-1">
                    <Form.Label>Email Adress</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                    />
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-3" disabled={isLoading}>
                    Sign In
                </Button>
                </Form>
                    {isLoading && <Loader />}
                <Row className="py-3">
                    <Col className="">
                        <p>New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link></p>
                        {/* si vengo de cart y ya estoy registrado, me lleva a shipping */}
                    </Col>
                </Row>


        </FormContainer>
    )
}
export default LoginScreen