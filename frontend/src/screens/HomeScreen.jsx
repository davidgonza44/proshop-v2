import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import Product from '../components/Product.jsx'
import { useGetProductsQuery } from '../slices/productsApiSlice.js'
import Loader from '../components/Loader.jsx'
import Message from '../components/Message.jsx'
import { Link, useParams } from 'react-router-dom'
import Paginacion from '../components/Paginacion.jsx'
import Carousel from '../components/CarouselComponent.jsx'


const HomeScreen = () => {

    const { keyword = '', pageNumber = 1 } = useParams()
    const { data, isLoading, isError } = useGetProductsQuery({ keyword, pageNumber: pageNumber }); // Renombrar `data` a `products`
    useEffect(()=> {
        document.title = 'Home'
    }, [])

    return isLoading ? (<Loader />) : (
        <>

            {!keyword && <Carousel />}

            {keyword && <Link as={Link} to={'/'} className='btn btn-light'>Go back</Link>}

            {!keyword && <h2 className='fw-bold'>Latest Products</h2>}

            <Row>
                {data.products.map(product => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        < Product product={product} />
                    </Col>
                ))}
            </Row>
            <Paginacion page={data.page} pages={data.pages} ></Paginacion>

        </>
    )
}

export default HomeScreen