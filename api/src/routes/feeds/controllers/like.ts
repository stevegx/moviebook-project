import type { Request, Response } from 'express'
import { FeedLike } from '@/lib/database/schema'

class Controller {
  async index(req: Request, res: Response) {
    try {
      const likes = await FeedLike.find({ feed_id: req.params.feed_id as string })

      return res.json(likes)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  async show(req: Request, res: Response) {
    try {
      const likes = await FeedLike.find({ feed_id: req.params.feed_id as string })

      return res.json(likes.length)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  async store(req: Request, res: Response) {
    const user_id = req.user.id

    try {
      const like = await FeedLike.create({ user_id, feed_id: req.params.feed_id as string })

      return res.status(201).json(like)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  async destroy(req: Request, res: Response) {
    try {
      const like = await FeedLike.findByIdAndDelete(req.params.id as string).lean()

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
