import type { Request, Response } from 'express'
import { Feed } from '@/lib/database/schema'
import type { FeedStoreInput, FeedUpdateInput } from '../schema'

class Controller {
  async index(req: Request, res: Response) {
    try {
      const feeds = await Feed.find()

      return res.json(feeds)
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
      const feed = await Feed.create(req.body)

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
