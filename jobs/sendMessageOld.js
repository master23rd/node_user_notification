import cron from 'node-cron'
import Users from '../data/users.js'
import nodemailer from 'nodemailer'
import moment from 'moment-timezone'

// const scheduler = cron.schedule('15 16 * * *', async () => {
//   await sendMessage()
//   console.log('message success')
// })

const sendMessage = async () => {
  const configMail = {
    host: 'smtp.gmail.com',
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER, //'adamworks23@gmail.com',
      pass: 'bqytnqiiqinohpwu',
    },
  }

  let transporter = await nodemailer.createTransport(configMail)

  //   const utc = new Date()
  //   const offset = utc.getTimezoneOffset()
  //   const local = new Date(utc.getTime() + offset * 60000)
  //   const usersTarget = Users.filter(
  //     (user) => user.birthDay.getDate() === local.getDate()
  //   )
  let localTime = moment()
  const usersTarget = Users.filter((user) => user.birthDay === localTime)
  console.log(usersTarget)
  //   res.status(200).json({ local: local, users: users })

  const messages = usersTarget.map((user) => ({
    from: configMail.auth.user,
    to: user.email,
    subject: 'Hi nice to meet you',
    html: `today is your birthday ${user.birthDay}`,
  }))
  const result = messages.map((message) =>
    transporter.sendMail(message, (err, res) => {
      if (err) {
        console.log(err)
      }
    })
  )
  await Promise.all(result)
}
// scheduler.start()

export { sendMessage }
