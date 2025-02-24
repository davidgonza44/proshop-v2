import React from 'react'
import { Carousel, Image } from 'react-bootstrap'
import { useGetTopProductsQuery } from '../slices/productsApiSlice'
import { Link } from 'react-router-dom'

const CarouselComponent = () => {
    const { data: topProducts, isLoading, error } = useGetTopProductsQuery()
    return isLoading ? '' : (
        <Carousel pause='hover' className='mt-0 mb-4 bg-secondary'>
            {topProducts.map(product => (

                    <Carousel.Item key={product._id} className='carousel w-100'>
                        <Link as={Link} to={`/product/${product._id}`} >
                            <Image className='carousel-img' src={product.image} fluid alt={product.name} />
                            <Carousel.Caption className='carousel-caption'>
                                <h3 className='fw-bold'>{product.name} (${product.price})</h3>
                            </Carousel.Caption>
                        </Link>
                    </Carousel.Item>

            ))}

        </Carousel>
    )
}

export default CarouselComponent