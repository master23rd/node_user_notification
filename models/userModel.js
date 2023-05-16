import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'please add first name'],
    },
    lastName: {
      type: String,
      required: [true, 'please add last name'],
    },
    birthDay: {
      type: Date,
      required: [true, 'please add birthday'],
      default: Date.now,
    },
    location: {
      type: String,
      required: [true, 'please add location'],
    },
    email: {
      type: String,
      required: [true, 'please add email'],
      unique: true,
    },
    password: {
      type: String,
      // required: [true, 'please add password'],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)
export default User
