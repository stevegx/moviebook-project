import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
})

const feedSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  movie_id: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  content: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
})

const feedLikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  feed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feed',
    required: true,
  },
}, {
  timestamps: true,
})

feedLikeSchema.index({ user: 1, feed: 1 }, { unique: true })

const feedCommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  feed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feed',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeedComment',
    default: null,
  },
}, {
  timestamps: true,
})

export const User = mongoose.model('User', userSchema)
export const Feed = mongoose.model('Feed', feedSchema)
export const FeedLike = mongoose.model('FeedLike', feedLikeSchema)
export const FeedComment = mongoose.model('FeedComment', feedCommentSchema)
