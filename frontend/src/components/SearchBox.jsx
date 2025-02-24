import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useGetProductsQuery } from '../slices/productsApiSlice'

const SearchBox = () => {
    const [keyword, setKeyword] = useState('')
    const navigate = useNavigate()

    const submitHandler = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            navigate(`/search/${keyword}`)
            setKeyword('')


        }
        else {
            navigate('/')
        }
    }
    return (

        <Form className='d-flex' type='submit' onSubmit={submitHandler}>
            <Form.Control
                type='search'
                placeholder='Search'
                className='me-2'
                aria-label='Search'
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />

            <Button className='me-2' variant='outline-light' type='submit'>Search</Button>
        </Form>


    )
}

export default SearchBox