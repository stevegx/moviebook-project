import type { Request, Response } from 'express'
import { FeedLike } from '@/lib/database/schema'

class Controller {
  async index(req: Request, res: Response) {
    try {
      const likes = await FeedLike
        .find({ feed: req.params.feed as string })
        .populate('user', '-password')
        .lean()

      return res.json(likes)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  async show(req: Request, res: Response) {
    try {
      const likes = await FeedLike
        .find({ feed: req.params.feed as string })
        .populate('user', '-password')
        .lean()

      return res.json(likes.length)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  async store(req: Request, res: Response) {
    try {
      const like = await FeedLike.create({ user: req.user.id, feed: req.params.feed as string })
      const populatedLike = await like.populate('user', '-password')

      return res.status(201).json(populatedLike)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  async destroy(req: Request, res: Response) {
    try {
      const like = await FeedLike
        .findByIdAndDelete(req.params.id)
        .populate('user', '-password')
        .lean()

      if (!like) {
        return res.status(404).json({ message: "Like not found" })
      }

      return res.json(like)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }
}

export default new Controller()
