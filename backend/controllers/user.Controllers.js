import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc Auth user & get TOKEN
// @route POST/api/users/auth
// @access Public

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id)
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(401)
        throw new Error("Invalid email or password")
    }
}
)

// @desc Register user
// @route GET/api/users/register
// @access Public

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400) // client error
        throw new Error("User already exists")
    }
    const user = await User.create({
        name,
        email,
        password
    })
    if (user) {
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(400)
        throw new Error("Invalid user Data")
    }
})

// @desc logout user / clear cookie
// @route Post/api/users/logout
// @access Private

const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('jwt')
    res.status(200)
    res.json({ message: 'User Logged out' })
})

// @desc get user profile
// @route Get/api/users/profile
// @access Private

const updateUserProfile = asyncHandler(async (req, res) => {
    const {name,email,password} = req.body
    const user = await User.findById(req.user._id)
    if (user){
        user.name = name || user.name
        user.email = email || user.email
        if (password){
            user.password = password || user.password
        }
        const updatedUser = await user.save()
        res.status(200).json({
            _id : updatedUser._id,
            name : updatedUser.name,
            email : updatedUser.email,
            isAdmin : updatedUser.isAdmin
        })
    } else {
        res.status(404)
        throw new Error("User Not Found")
    }

})

// @desc get user profile
// @route Get/api/users/profile
// @access Private

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        res.status(200).json({
            _id: user._id,
            name : user.name,
            email : user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})

// @desc getAllUsers
// @route Get/admin/users
// @access Private/admin

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    if (!users){
        res.status(404)
        throw new Error("Users not found")
    }
    res.json(users)
})

// @desc get user by id
// @route Get/api/users
// @access Private/admin

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if (!user){
        res.status(404)
        throw new Error('User not found')
    }
    res.status(200).json(user)
}
)

// @desc Delete User
// @route Delete/api/users:id
// @access Private/admin

const deleteUser = asyncHandler(async (req, res) => {
    await User.deleteOne({ _id : req.params.id})
    res.status(200).json({message : 'User deleted'})
})

// @desc update User
// @route Put/api/users:id
// @access Private/admin

const updateUser = asyncHandler(async (req, res) => {
    console.log('parametros= ',req)
    const user = await User.findById(req.params.id)
    if(!user){
        res.status(404)
        throw new Error('User not Found')}

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin =   req.body.isAdmin
    const updatedUser = await user.save()

    res.status(200).json({
        _id : updatedUser._id,
        name : updatedUser.name,
        email : updatedUser.email,
        isAdmin : updatedUser.isAdmin
    })

})



export {
    authUser,
    getAllUsers,
    updateUser,
    deleteUser,
    getUserProfile,
    logoutUser,
    registerUser,
    updateUserProfile,
    getUserById
}