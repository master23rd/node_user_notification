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
    birthDay: moment().tz(moment.tz.guess()).startOf('date'),
  }).lean()
  const usersIds = users.map((u) => u._id)

  //@desc if there are new data store to jobs
  if (users.length) {
    const jobs = await Job.find({
      user: { $in: usersIds },
    })
      .select({ user: 1, _id: 0 })
      .populate('user')

    //@desc list user that not have job list
    const compareJob = jobs.map((j) => j.user._id.toString())
    const target = users.filter(
      (user) => !compareJob.includes(user._id.toString())
    )

    //@desc set new jobs based on user birthday
    if (target || target.length != 0) {
      target.map(async (user) => {
        await Job.create({
          user: user._id,
          message: `today is your day ${user.birthDay}`,
        })
      })
    }
  }

  //@desc fetch new update with populate user
  const updateJobs = await Job.find({ isActive: true }).populate('user')

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

              //@desc if response success then update jobs
              if (response.status === 200) {
                console.log('Schedule is success ========>')
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
