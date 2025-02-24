import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

const AdminRoute = () => {
    const {userInfo} = useSelector(state => state.auth)
    const navigate = useNavigate()
    return userInfo && userInfo.isAdmin ? <Outlet/> : navigate('/')
}

export default AdminRoute