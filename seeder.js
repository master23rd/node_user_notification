import dotenv from 'dotenv'
import users from './data/users.js'
import jobs from './data/jobs.js'
import User from './models/userModel.js'
import Job from './models/jobModel.js'
import connectDB from './config/db.js'

dotenv.config()

connectDB()

const importData = async () => {
  try {
    await Job.deleteMany()
    await User.deleteMany()

    await User.insertMany(users)
    await Job.insertMany(jobs)

    // await Product.insertMany(sampleProducts)
    console.log('data imported')
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Job.deleteMany()
    await User.deleteMany()

    console.log('data imported')
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
