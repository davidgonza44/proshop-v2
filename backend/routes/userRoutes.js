import express from 'express';
import {
    authUser,
    getAllUsers,
    updateUser,
    deleteUser,
    getUserProfile,
    logoutUser,
    registerUser,
    updateUserProfile,
    getUserById,
}
    from "../controllers/user.Controllers.js";
import { admin, protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.route('/auth').post(authUser)
router.route('/register').get(protect,admin, getAllUsers).post(registerUser)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
router.route('/logout').post(protect , logoutUser)
router.route('/:id').get(protect,admin,getUserById).delete(protect,admin,deleteUser).put(protect,admin,updateUser)
router.get('/admin/users' , protect, admin , getAllUsers)
router.delete('/admin/user/:id', protect, admin, deleteUser)
router.put('/admin/user/:id', protect, admin, updateUser )
router.get('/admin/user/:id', protect, admin, getUserById )

export default router
