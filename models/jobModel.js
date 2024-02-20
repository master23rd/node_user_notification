import mongoose from 'mongoose'

const jobSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'User',
    },
    message: {
      type: String,
      required: [true],
    },
    retries: {
      type: Number,
      default: 0,
    },
    lastSend: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Job', jobSchema)
