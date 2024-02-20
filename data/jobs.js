import bcrypt from 'bcryptjs'
import moment from 'moment-timezone'

const jobs = [
  {
    user: '6462deec21851eced20f5c59',
    message: 'today is your day',
    retries: 0,
    lastSend: moment('2023-05-15').startOf('day'),
    isActive: true,
  },
  {
    user: '6462deec21851eced20f5c89',
    message: 'today is your day',
    retries: 0,
    lastSend: moment('2023-05-15').startOf('day'),
    isActive: true,
  },
]

export default jobs
