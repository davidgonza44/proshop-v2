import React, { useState } from 'react'
import { Col, Table, Row, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery, useUpdateProductMutation } from '../../slices/productsApiSlice'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaEdit, FaTrash, FaTrashAlt } from 'react-icons/fa'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import Paginacion from '../../components/Paginacion'

const ProductsListScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const {keyword = '', pageNumber = '1'} = useParams()

    const [deleteProduct, { isLoading: deleteLoading, error: deleteError }] = useDeleteProductMutation()
    const [updateProduct, {isLoading : updateLoading, error : updateError}] = useUpdateProductMutation()
    const [createProduct , {isLoading : createLoading ,error : createError}] = useCreateProductMutation()
    const { data, isLoading, error, refetch} = useGetProductsQuery({keyword , pageNumber});


    const deleteProductHandler = async(Id) => {
        if (window.confirm('Are you sure you want to delete this?')){
            try {
                await deleteProduct(Id)
                refetch()
                toast.success('Product deleted successfully')

            } catch (error) {
                toast.error(error?.data?.message || error)
            }
        }
    }

    const createProductHandler = async()=> {
        try {
            await createProduct()
            refetch()
            toast.success('Product created successfully')
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
    }

    return isLoading ? <Loader /> : (
        <div>
            <Row>
                <Col md={10}>
                    <h1>Products</h1>
                </Col>
                <Col md={2}>
                    <Button type="button" className="btn btn-primary btn-sm m-3" onClick={()=> createProductHandler()}>
                        <FaEdit ></FaEdit> Create Product
                    </Button>
                </Col>
            </Row>
            <Table bordered striped hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>PRICE</th>
                        <th>CATEGORY</th>
                        <th>BRAND</th>
                        <th></th>
                    </tr>

                </thead>

                {isLoading && <Loader/>}
                {deleteLoading && <Loader/>}

                    <tbody>
                        {data.products && data.products.map(product => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <Link as={Link} className='me-2' to={`/admin/product/${product._id}/edit`}><FaEdit className='text-primary'></FaEdit></Link>
                                    <Button className='btn-sm' onClick={() => deleteProductHandler(product._id)}><FaTrashAlt className='text-danger text-sm' ></FaTrashAlt></Button >
                                </td>
                            </tr>
                        ))}


                    </tbody>
            </Table>
            <Paginacion page={data.page} pages={data.pages} isAdmin={true} ruta='products' />
        </div>
    )
}

export default ProductsListScreen