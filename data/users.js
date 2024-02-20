import bcrypt from 'bcryptjs'
import moment from 'moment-timezone'

const users = [
  {
    firstName: 'adam',
    lastName: 'prasetia',
    email: 'adam23rd@gmail.com',
    birthDay: moment('2023-05-16').startOf('day'),
    location: 'Asia/Jakarta',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    firstName: 'Admin',
    lastName: 'Users',
    email: 'adamworks23@gmail.com',
    birthDay: moment('2023-05-15').startOf('day'),
    location: 'Australia/Melbourne',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
]

export default users
