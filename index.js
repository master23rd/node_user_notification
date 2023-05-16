import express from 'express'
import dotenv from 'dotenv'
import jobInstance from './jobs/jobsInstance.js'
import userRoutes from './routes/userRoutes.js'
import connectDB from './config/db.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

connectDB()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// scheduler instance
await jobInstance.start()

// app.use('/', async (req, res, next) => {
//   res.status(200).json('welcome to scheduler service')
//   next()
// })

//manage users
app.use('/api/users', userRoutes)

//error global handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
