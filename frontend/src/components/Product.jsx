import React from 'react'
import { Card, CardGroup, start } from 'react-bootstrap'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Rating from './Rating.jsx'
import Message from './Message.jsx'


const Product = ({ product }) => {
    return (
        <>
            <Card className='my-3 p-3 rounded'>
                <Link to={`/product/${product._id}`}>
                    <Card.Img src={product.image} className = 'image-preview'alt='product' variant='top'/>
                </Link>
                <Card.Body>
                    <Link to={`/product/${product._id}`}>
                        <Card.Title className='product-title' as='div'>
                            <strong>{product.name}</strong>
                        </Card.Title>
                    </Link>

                    <Card.Text as='div'>
                        <Rating product={product}/>
                    </Card.Text>

                    <Card.Text as='h3'>
                        <strong>${product.price}</strong>
                    </Card.Text>

                </Card.Body>
            </Card>
        </>
    )
}

export default Product