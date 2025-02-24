import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useDeleteUserMutation, useGetUsersQuery } from '../../slices/usersApiSlice'
import Loader from '../../components/Loader'
import { Link, useParams } from 'react-router-dom'
import { FaCheck, FaEdit, FaTimes, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'

const UsersListScreen = () => {
    const {data: users , isLoading, error , refetch} = useGetUsersQuery()
    const [deleteUser, {isLoading: deleteLoading}] = useDeleteUserMutation()


    const deleteHandler = async(id) => {
        if (window.confirm('Are you sure?')){
            try {
                const res = await deleteUser(id).unwrap()
                refetch()
                toast.success('User deleted succesfully')
            } catch (error) {
                toast.error(error?.data?.message || error)
            }
        }

    }

    return isLoading ? <Loader/> : (
        <div>
            <h1>Users</h1>
            <Table bordered striped hover responsive>
                {isLoading && <Loader/>}
                {error && <div>{error}</div>}
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>ADMIN</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{!user.isAdmin ? <FaTimes style={{color: 'red'}}></FaTimes> : <FaCheck style={{color: 'green'}}></FaCheck>}</td>
                            <td>
                                {deleteLoading && <Loader/>}
                                <Link to={`/admin/user/${user._id}/edit`}><FaEdit></FaEdit></Link>
                                <Link onClick={(e) => deleteHandler(user._id)} className='ms-2'><FaTrash style={{color: 'red'}}></FaTrash></Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default UsersListScreen