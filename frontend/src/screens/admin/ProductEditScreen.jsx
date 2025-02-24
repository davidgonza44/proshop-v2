
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, ListGroup, Row, Toast } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { useGetSingleProductQuery, useUpdateProductMutation, useUploadProductImageMutation } from '../../slices/productsApiSlice'
import Message from '../../components/Message'
import { toast } from 'react-toastify'

const ProductEditScreen = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [category, setCategory] = useState('')
    const [brand, SetBrand] = useState('')
    const [image, setImage] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')

    const { data: productDetails, isLoading, refetch, error } = useGetSingleProductQuery(id)
    const [update, { isLoading: loadingUpdate, error: errorUpdate, data: dataUpdate }] = useUpdateProductMutation()
    const [uploadProductImage, {isLoading : loadingUploadImage, error : errorUploadProductImage}] = useUploadProductImageMutation()
    console.log(image)

    useEffect(() => {
        if (productDetails) {
            setName(productDetails.name)
            setPrice(productDetails.price)
            setCategory(productDetails.category)
            SetBrand(productDetails.brand)
            setCountInStock(productDetails.countInStock)
            setDescription(productDetails.description)
            setImage(productDetails.image)
        }
    }, [productDetails])

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const res = await update(
                {
                    _id: id,
                    name,
                    price,
                    image,
                    category,
                    brand,
                    countInStock,
                    description
                }
            ).unwrap()
            await refetch()
            if (res.error) {
                toast.error(res.error)
            } else {
                toast.success('Product updated')
                console.log('ed')
                navigate('/admin/products')

            }
        }

        catch (error) {
            toast.error( error)
        }

    }

    const uploadFileHandler = async(e) => {
        const formData = new FormData()
        formData.append('image', e.target.files[0])
        // console.log(formData)
        // console.log(e.target.files[0].type + '  type')
        try {
            const res = await uploadProductImage(formData).unwrap()
            console.log(res)
            setImage(res.image)
            toast.success('Image uploaded')
        } catch (error) {
            toast.error(error?.data?.message || error)
        }
    }

    return (
        <div>

            <Link to='/admin/products' className='btn btn-light my-0 btn-sm'>Go back</Link>
            <FormContainer >

                <h3 className=''>Edit Product</h3>
                {loadingUpdate && <Loader />}
                {isLoading ? <Loader /> : error ? <Message variant='danger'></Message> : ''}
                <Form onSubmit={submitHandler}>
                    <Form.Group className='my-1' controlId='name'>
                        <Form.Label> Name</Form.Label>
                        <Form.Control size='sm' onChange={(e) => setName(e.target.value)} value={name} type='text' placeholder='Enter name' />
                    </Form.Group>
                    <Form.Group className='my-1' controlId='price'>
                        <Form.Label> Price</Form.Label>
                        <Form.Control size='sm' onChange={(e) => setPrice(e.target.value)} value={price} type='number' placeholder='Enter name' />
                    </Form.Group>

                    <Form.Group className='my-1' controlId='image'>
                        <Form.Label> Image</Form.Label>
                        <Form.Control size='sm' value={image} onChange={(e)=> setImage(e.target.value)}></Form.Control>
                        <Form.Control size='sm' type='file' placeholder='Enter image' onChange={(e) => uploadFileHandler(e)}/>

                    </Form.Group>
                    <Form.Group className='my-1' controlId='brand'>
                        <Form.Label> Brand</Form.Label>
                        <Form.Control size='sm' onChange={(e) => SetBrand(e.target.value)} value={brand} type='text' placeholder='Enter name' />
                    </Form.Group>
                    <Form.Group className='my-1' controlId='stock'>
                        <Form.Label>Stock</Form.Label>
                        <Form.Control size='sm' onChange={(e) => setCountInStock(e.target.value)} value={countInStock} type='number' placeholder='Enter name' />
                    </Form.Group>
                    <Form.Group className='my-1' controlId='category'>
                        <Form.Label> Category</Form.Label>
                        <Form.Control size='sm' onChange={(e) => setCategory(e.target.value)} value={category} type='text' placeholder='Enter name' />
                    </Form.Group>
                    <Form.Group className='my-1' controlId='description'>
                        <Form.Label> Description</Form.Label>
                        <Form.Control rows={3} as='textarea' onChange={(e) => setDescription(e.target.value)} value={description} type='text' placeholder='Enter name' />
                    </Form.Group>

                    <Button type='submit' className='btn btn-block w-100'>Update</Button>
                </Form>
            </FormContainer>
        </div>
    )
}

export default ProductEditScreen