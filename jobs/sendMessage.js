import { parentPort } from 'worker_threads'
import nodemailer from 'nodemailer'
import moment from 'moment-timezone'
import axios from 'axios'
import connectDB from '../config/db.js'
import User from '../models/userModel.js'
import Job from '../models/jobModel.js'

//@desc worker threads variable
let isCanceled = false
if (parentPort) {
  parentPort.once('message', (message) => {
    if (message === 'cancel') isCanceled = true
  })
}

//@desc IIFE
;(async (timeZone, schedule) => {
  console.log('Checking User Detail ========>')
  //@desc collect user data
  connectDB()
  const users = await User.find({
    birthDay: moment().tz(moment.tz.guess()).startOf('day'),
  })
  // console.log(users)

  //@desc if there are new data store to jobs
  if (users.length != 0) {
    const jobs = await Job.find({}).select({ user: 1, _id: 0 })

    // issue
    const target = users.filter((user) => {
      const compareJob = jobs.map((job) => job.user.toString())
      return user._id.toString() !== compareJob.toString()
    })

    // console.log(target)
    //@desc set new jobs based on user birthday
    if (target || target.length != 0) {
      target.map(async (data) => {
        await Job.create({
          user: data._id,
          message: `today is your day ${data.birthDay}`,
        })
      })
    }
  }

  //@desc fetch new update with populate user
  const updateJobs = await Job.find({ isActive: true }).populate('user')

  console.log(updateJobs)

  //@desc run all promise
  await Promise.all(
    updateJobs.map(async (updateJob) => {
      return new Promise(async (resolve, reject) => {
        try {
          //@desc check condition and schedule to localtime user - using moment
          if (isCanceled) return
          if (
            moment().tz(timeZone).format('YYYY-MM-DD HH:mm') >=
            moment(schedule, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')
          ) {
            console.log('Schedule is Proccessing now ========>')
            try {
              //@desc call api email service
              const response = await axios.post(
                `${process.env.EMAIL_SERVICE}/send-email`,
                {
                  email: updateJob.user.email,
                  message: updateJob.message,
                }
              )

              console.log(response)
              //@desc if response success then update jobs
              if (response.status === 200) {
                await Job.findOneAndUpdate(
                  { _id: updateJob._id },
                  { isActive: false }
                )
              }
            } catch (error) {
              console.log(error)
            }
            resolve()
          } else {
            resolve()
          }
        } catch (error) {
          reject(error)
        }
      })
    })
  )
  if (parentPort) parentPort.postMessage('done')
  else process.exit(0)
})(moment.tz.guess(), moment().set({ hour: 9, minute: 0, second: 0 }))
//@desc check timezone, set scheduler
