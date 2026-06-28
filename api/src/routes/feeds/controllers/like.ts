import type { Request, Response, NextFunction } from 'express'
import { FeedLike } from '@/lib/database/schema'

class Controller {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const likes = await FeedLike
        .find({ feed: req.params.feed as string })
        .populate('user', '-password')
        .lean()

      return res.json(likes)
    } catch (error) {
      next(error)
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await FeedLike.countDocuments({
        feed: req.params.feed as string,
      })

      return res.json(count)
    } catch (error) {
      next(error)
    }
  }

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const like = await FeedLike.create({
        user: req.user.id,
        feed: req.params.feed as string,
      })
      
      const populatedLike = await like.populate('user', '-password')

      return res.status(201).json(populatedLike)
    } catch (error) {
      next(error)
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const like = await FeedLike
      .findByIdAndDelete(req.params.id)
        .populate('user', '-password')
        .lean()

      if (!like) {
        return res.status(404).json({ message: 'Like not found' })
      }

      return res.json(like)
    } catch (error) {
      next(error)
    }
  }
}

export default new Controller()
