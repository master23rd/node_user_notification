import express from 'express'
const router = express.Router()

import {
  getUsers,
  addUser,
  deleteUser,
  updateUser,
} from '../controllers/UserController.js'

router.get('/', getUsers)
router.post('/', addUser)
router.delete('/:id', deleteUser)
router.put('/:id', updateUser)

export default router
