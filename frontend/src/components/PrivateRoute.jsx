
import { useSelector } from "react-redux"
import { Navigate, Outlet, useNavigate } from "react-router-dom"

const PrivateRoute = () => {
    const {userInfo} = useSelector((state) => state.auth)
    const navigate = useNavigate()



    return userInfo ? <Outlet /> : <Navigate to={'/auth'} />
}

export default PrivateRoute