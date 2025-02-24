import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Product from '../components/Product'
import { Col, Row, ListGroup, Button, Form, Image, Card, ListGroupItem } from 'react-bootstrap'
import Rating from '../components/Rating'
import { useCreateProductReviewMutation, useGetSingleProductQuery } from '../slices/productsApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { addToCart } from '../slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import RatingStars from '../components/RatingStars'
import { toast } from 'react-toastify'

const ProductScreen = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id: productId } = useParams()
    const { data: product, isLoading, isError, refetch } = useGetSingleProductQuery(productId)
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [createProductReview] = useCreateProductReviewMutation()
    const { userInfo } = useSelector(state => state.auth)

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }))
        navigate('/cart')
    }

    useEffect(()=> {
        document.title = product?.name || 'Default Title'
    })

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const res = await createProductReview({
                name: userInfo.name,
                rating,
                comment,
                productId
            }).unwrap()
            console.log('respuesta= ', res)
            toast.success('Review submitted')
            setRating(0)
            setComment('')
            refetch()
            console.log('ddd')
        } catch (error) {
            toast.error(error?.data?.message || error)
        }
    }

    if (isLoading) return <Loader />
    if (isError) return <Message variant='danger' >Something went wrong</Message>

    return (
        <>

            <Link className='btn btn-light my-3 fw-bold' to='/'>Go back</Link>
            <Row>
                <Col md={5} lg={5}>
                    <Image src={product.image} alt={product.name} fluid />
                </Col>

                <Col md={4} lg={4}>
                    <ListGroup variant='flush' >
                        <ListGroup.Item >
                            <h3><strong>{product.name}</strong></h3>
                        </ListGroup.Item>
                        <ListGroup.Item className=''>
                            <Rating product={product} option={true} />
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Price: ${product.price}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Description: {product.description}
                        </ListGroup.Item>

                    </ListGroup>
                </Col>

                <Col md={3} lg={3}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Price:</Col>
                                    <Col><strong>${product.price}</strong></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Status:</Col>
                                    <Col>
                                        <strong>{product.countInStock > 0 ? 'In stock' : 'Out of stock'}</strong>
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            {product.countInStock > 0 && (
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Qty:</Col>
                                        <Col>
                                            <Form.Control
                                                as='select'
                                                type='number'
                                                value={qty}
                                                onChange={(e) => setQty(Number(e.target.value))}
                                                min={1}
                                                max={product.countInStock}
                                            >
                                                {[...Array(product.countInStock).keys()].map(x => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}


                                            </Form.Control>


                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )}

                            <ListGroup.Item>
                                <Button className='btn btn-block' disabled={product.countInStock === 0}
                                    onClick={addToCartHandler}
                                >
                                    Add to cart
                                </Button>
                            </ListGroup.Item>

                        </ListGroup>
                    </Card>
                </Col>
            </Row>
            {isLoading && <Loader />}

            <Row className='review'>
                <Col md={6}>
                    <h2>Reviews</h2>
                    {product.reviews.length === 0 && (
                        <Message variant='info'>No reviews</Message>)}

                    {product.reviews.length > 0 && (
                        <ListGroup variant='flush'>
                            {product.reviews.map(review => (
                                <ListGroup.Item key={review._id} style={{ borderBottom: '1px solid #ccc' }}>
                                    <strong className='' style={{display : 'block'}}>{review.name}</strong>
                                    <Rating className = 'my-0' product={product} option={false} />
                                    <p>{review.createdAt.substring(0, 10)}</p>
                                    <p>{review.comment}</p>
                                </ListGroup.Item>

                            ))}
                        </ListGroup>




                    )}

                    {/* <ListGroup variant='flush'>


                        <ListGroup.Item>d</ListGroup.Item>
                        <ListGroup.Item>d</ListGroup.Item>
                        <ListGroup.Item>d</ListGroup.Item>
                    </ListGroup> */}



                    <h2 className='review ms-2'>
                        Write a customer review
                    </h2>
                    <Form className='ms-2' onSubmit={submitHandler}>
                        <Form.Group className='mb-2' controlId='rating'>
                            <Form.Label>Rating</Form.Label>
                            <RatingStars rating={rating} setRating={setRating} ></RatingStars>
                        </Form.Group>
                        <Form.Group className='mb-2' controlId='comment'>
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows={2}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}>

                            </Form.Control>
                        </Form.Group>

                        <Button type='submit' className='btn btn-block'>Submit</Button>
                    </Form>

                </Col>
            </Row>
        </>
    )
}

export default ProductScreen