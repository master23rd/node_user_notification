import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import moment from 'moment-timezone'
import bcrypt from 'bcryptjs'

// @desc get all users
// @route GET /api/users
// @access public
const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    console.log(error)
  }
})

// @desc add new user
// @route POST /api/users
// @access public
const addUser = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, birthDay, location, email } = req.body

    if (!firstName || !lastName || !birthDay || !location || !email) {
      res.status(400)
      throw new Error('please include all fields')
    }

    //if need to password
    // const salt = await bcrypt.genSalt(10)
    // const hashedPassword = await bcrypt.hash(password,salt)

    const user = await User.create({
      firstName,
      lastName,
      birthday: moment(birthDay).startOf('day'),
      location,
      email,
    })

    if (user) {
      res.status(200).json({
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        birthDay: moment(birthDay).format('YYYY-MM-DD'),
        location: user.location,
      })
    } else {
      res.status(400)
      throw new Error('invalid user data')
    }
  } catch (error) {
    throw new Error(error)
  }
})

// @desc delete data user
// @route DEL /api/users/:id
// @access public
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      res.status(400)
      throw new Error('User not found')
    }

    await User.deleteOne({ _id: req.params.id })
    res.status(200).json({ success: true })
  } catch (error) {
    throw new Error(error)
  }
})

// @desc edit data user
// @route PUT /api/users/:id
// @access public
const updateUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      res.status(400)
      throw new Error('User not found')
    }

    console.log(req.body)
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthday: moment(req.body.birthDay).startOf('day'),
        location: req.bodylocation,
        email: req.body.email,
      },
      {
        new: true,
      }
    )

    res.status(200).json({ updatedUser })
  } catch (error) {
    throw new Error(error)
  }
})

export { getUsers, addUser, deleteUser, updateUser }
