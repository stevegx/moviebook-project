import type { Request, Response } from 'express'
import { Feed } from '../../../lib/database/schema.js'
import type { FeedStoreInput, FeedUpdateInput } from '../schema.js'

class Controller {
  async index(req: Request, res: Response) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1)
      const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 10))
      const skip = (page - 1) * limit
      const query = Feed.find(req.query.mine === 'true' ? { user: req.user!.id } : {})

      const [feeds, total] = await Promise.all([
        query
          .clone()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('user', 'name username'),
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
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
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
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  async store(req: Request<{}, {}, FeedStoreInput>, res: Response) {
    try {
      const feed = await Feed.create({ user: req.user!.id, ...req.body })

      return res.status(201).json(feed)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  async update(req: Request<{ id: string }, {}, FeedUpdateInput>, res: Response) {
    try {
      const feed = await Feed.findOneAndUpdate(
        { _id: req.params.id, user: req.user!.id },
        req.body,
        { returnDocument: 'after', runValidators: true }
      )

      if (!feed) {
        return res.status(404).json({ error: 'Feed not found' })
      }

      return res.json(feed)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  async destroy(req: Request<{ id: string }>, res: Response) {
    try {
      const feed = await Feed.findOneAndDelete({ _id: req.params.id, user: req.user!.id })

      if (!feed) {
        return res.status(404).json({ error: 'Feed not found' })
      }

      return res.json(feed)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default new Controller()
