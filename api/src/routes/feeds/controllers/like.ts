import type { Request, Response, NextFunction } from 'express'
import { FeedLike } from '../../../lib/database/schema.js'

class Controller {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const likes = await FeedLike
        .find({ feed: req.params.feed as string })
        .populate('user', 'name username')
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
        user: req.user!.id,
        feed: req.params.feed as string,
      })
      
      const populatedLike = await like.populate('user', 'name username')

      return res.status(201).json(populatedLike)
    } catch (error) {
      next(error)
    }
  }

  async destroy(req: Request<{ id: string; feed: string }>, res: Response, next: NextFunction) {
    try {
      const like = await FeedLike
        .findOneAndDelete({ _id: req.params.id, feed: req.params.feed, user: req.user!.id })
        .populate('user', 'name username')
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
