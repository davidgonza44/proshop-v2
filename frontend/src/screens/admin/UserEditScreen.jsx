import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEditUserMutation, useGetUserDetailsQuery } from '../../slices/usersApiSlice'
import { Button, Form, FormGroup } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import FormContainer from '../../components/FormContainer'

const UserEditScreen = () => {
    const [editUser, { isLoading: loadingUpdateUser }] = useEditUserMutation()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [admin, setAdmin] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()
    const {data:user, isLoading : loadingUser, refetch} = useGetUserDetailsQuery(id)
    console.log('id == ' , id)

    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
            setAdmin(user.isAdmin)
        }
    }, [user])

    const submitHandler = async(e) =>{
        e.preventDefault()
        try {
            const userUpdated = {
                id : id,
                name,
                email,
                isAdmin : admin
            }



            await editUser(userUpdated).unwrap()
            refetch()
            toast.success('User updated')
            navigate('/admin/users')
        }
        catch (error) {
            toast.error( error.message)
        }
    }

    return (
        <FormContainer >
            <Link className='btn btn-light my-3' as={Link} to={'/admin/users'}>Go back</Link>
            <Form onSubmit={submitHandler}>
                <h1>Edit User</h1>
                <FormGroup className='mb-2'>
                    <Form.Label>First name</Form.Label>
                    <Form.Control type='text' value={name} onChange={(e) => setName(e.target.value)} />
                </FormGroup>
                <FormGroup className='mb-2'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                </FormGroup>
                <FormGroup className='mb-3'>
                    <Form.Label>Admin</Form.Label>
                    <Form.Check
                        type='checkbox'
                        label='Is Admin?'
                        checked={admin}
                        onChange={(e) => setAdmin(e.target.checked)}
                    />
                </FormGroup>

                <Button
                    type='submit'
                    className='btn btn-block'
                    >
                    Update
                </Button>

            </Form>
        </FormContainer>
    )
}

export default UserEditScreen