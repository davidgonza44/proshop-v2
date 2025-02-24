import { Container, Row, Col, Navbar, NavDropdown, NavbarCollapse, Nav, Badge } from 'react-bootstrap'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useLogoutMutation } from '../slices/usersApiSlice'
import { loggingOut, setCredentials } from '../slices/authSlice'
import { cleanCart } from '../slices/cartSlice'
import SearchBox from './SearchBox'

const Header = () => {
    const { cartItems } = useSelector(state => state.cart)
    const [activeLink, setActiveLink] = useState('')
    const { userInfo } = useSelector(state => state.auth)
    const [logout, { isLoading }] = useLogoutMutation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const cart = useSelector(state => state.cart)

    const location = useLocation()
    const currentPath = location.pathname

    const logoutHandler = async (e) => {
        try {
            await logout().unwrap()
            dispatch(loggingOut())
            dispatch(cleanCart())
            navigate('/auth')
        } catch (error) {
            console.log(error)
        }

    }

    const handleLinkClick = (linkName) => {
        setActiveLink(linkName)
    }

    return (
        <div >
            <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect className='py-3'>
                <Container>
                    <img src={logo} alt="Logo de Proshop" />
                    <Navbar.Brand className='fw-bolder' as={Link} to='/'>ProShop</Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='ms-auto'>
                            <SearchBox />
                            <Nav.Link as={Link} to='/cart' onClick={(e) => handleLinkClick('cart')} style={{ color: currentPath === '/cart' ? 'white' : 'rgb(51, 51, 51)' }}>
                                <FaShoppingCart /> Cart
                                {cartItems.length > 0 &&
                                    <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                                        {cartItems.reduce((a, c) => a + c.qty, 0)}
                                    </Badge>}
                            </Nav.Link>
                            {userInfo ?
                                userInfo.isAdmin ? (
                                    <>
                                        <NavDropdown title={<><FaUser /> {userInfo.name}</>}
                                            id='basic-nav-dropdown'>
                                            <Nav.Link
                                                as={Link}
                                                to={'/profile'}
                                                onClick={(e) => handleLinkClick('profile')}
                                                style={{
                                                    backgroundColor: currentPath === '/profile' ? 'rgb(42, 42, 66)' : 'white',
                                                    color: currentPath === '/profile' ? 'white' : 'rgb(51, 51, 51)'

                                                }}>
                                                Profile
                                            </Nav.Link>
                                            <Nav.Link
                                                as={Link}
                                                to={'/'}
                                                onClick={(e) => { logoutHandler() }}
                                                style={{
                                                    backgroundColor: currentPath === '/logout' ? 'rgb(42,42,66)' : 'white',
                                                    color: currentPath === '/logout' ? 'white' : 'rgb(51, 51, 51)'
                                                }}
                                            >
                                                Logout

                                            </Nav.Link>
                                        </NavDropdown>

                                        <NavDropdown title='Admin' id='admin-nav-dropdown'>
                                            <Nav.Link
                                                as={Link}
                                                to={'/admin/ordersList'}
                                                onClick={(e) => handleLinkClick('/admin/ordersList')}
                                                style={{ backgroundColor: currentPath === '/admin/ordersList' ? 'rgb(42,42,66)' : 'white', color: currentPath === '/admin/ordersList' ? 'white' : 'rgb(51, 51, 51)' }}>
                                                List Orders
                                            </Nav.Link>
                                            <Nav.Link
                                                as={Link}
                                                to='/admin/products'
                                                onClick={(e) => handleLinkClick('/admin/products')}
                                                style={{ backgroundColor: currentPath === '/admin/products' ? 'rgb(42,42,66)' : 'white', color: currentPath === '/admin/products' ? 'white' : 'rgb(51, 51, 51)' }}
                                            >
                                                Products
                                            </Nav.Link>
                                            <Nav.Link
                                                as={Link}
                                                to='/admin/users'
                                                onClick={(e) => handleLinkClick('/admin/users')}
                                                style={{ backgroundColor: currentPath === '/admin/users' ? 'rgb(42,42,66)' : 'white', color: currentPath === '/admin/users' ? 'white' : 'rgb(51,51,51)' }}>
                                                    Users
                                            </Nav.Link>
                                        </NavDropdown>
                                    </>

                                )

                                    :
                                    (<NavDropdown title={
                                        <>
                                            <FaUser /> {userInfo.name}
                                        </>
                                    }
                                        id='basic-nav-dropdown'>
                                        <Nav.Link
                                            as={Link}
                                            to={'/profile'}
                                            onClick={(e) => handleLinkClick('profile')}
                                            style={{ color: currentPath === '/profile' ? 'white' : 'rgb(51,51,51)' }}
                                        >
                                            Profile
                                        </Nav.Link>
                                        <Nav.Link
                                            as={Link}
                                            to={'/'}
                                            onClick={(e) => { logoutHandler() }}
                                            style={{ color: currentPath === '/logout' ? 'white' : 'rgb(51,51,51)' }}
                                        >
                                            Logout

                                        </Nav.Link>
                                    </NavDropdown>)


                                :
                                (<Nav.Link
                                    as={Link}
                                    to={'/auth'}
                                    onClick={(e) => handleLinkClick('/auth')}
                                    style={{ color: currentPath === '/auth' ? 'white' : 'rgb(51,51,51)' }}>
                                    <FaUser /> Sign In
                                </Nav.Link>
                                )}

                        </Nav>
                    </Navbar.Collapse>
                </Container>


            </Navbar>
        </div>
    )
}

export default Header;

