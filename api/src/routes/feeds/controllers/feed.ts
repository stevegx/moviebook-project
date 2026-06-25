import type { Request, Response } from 'express'
import { Feed } from '@/lib/database/schema'
import type { FeedStoreInput, FeedUpdateInput } from '../schema'

class Controller {
  async index(req: Request, res: Response) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1)
      const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 10))
      const skip = (page - 1) * limit
      const query = Feed.find()

      const [feeds, total] = await Promise.all([
        query
          .clone()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('user', '-password'),
        query.clone().countDocuments()
      ])

      const totalPages = Math.ceil(total / limit)  

      return res.json({
        data: feeds,
        page,
        limit,
        total,
        total_pages: totalPages
      })
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  async show(req: Request, res: Response) {
    try {
      const feed = await Feed.findById(req.params.id)

      if (!feed) {
        return res.status(404).json({ error: 'Feed not found' })
      }

      return res.json(feed)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  async store(req: Request<{}, {}, FeedStoreInput>, res: Response) {
    try {
      const feed = await Feed.create({ user: req.user.id, ...req.body })

      return res.status(201).json(feed)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  async update(req: Request<{ id: string }, {}, FeedUpdateInput>, res: Response) {
    try {
      const feed = await Feed.findByIdAndUpdate(req.params.id, req.body, { new: true })

      if (!feed) {
        return res.status(404).json({ error: 'Feed not found' })
      }

      return res.json(feed)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  async destroy(req: Request, res: Response) {
    try {
      const feed = await Feed.findByIdAndDelete(req.params.id)

      if (!feed) {
        return res.status(404).json({ error: 'Feed not found' })
      }

      return res.json(feed)
    } catch (error) {
      console.log(error);

      return res.status(500).json({ error })
    }
  }
}

export default new Controller()
