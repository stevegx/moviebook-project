import type { Request, Response } from 'express'
import { FeedComment } from '@/lib/database/schema'
import type { FeedCommentInput } from '../schema'

class Controller {
  async index(req: Request, res: Response) {
    try {
      const comments = await FeedComment.find(req.params).lean()

      return res.json(comments)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  async show(req: Request, res: Response) {
    try {
      const comment = await FeedComment.findById(req.params.id).lean()

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" })
      }

      return res.json(comment)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  async store(req: Request<{ feed_id: string }, {}, FeedCommentInput>, res: Response) {
    const user_id = req.user.id
    const { feed_id } = req.params
    const { content } = req.body

    try {
      const comment = await FeedComment.create({ user_id, feed_id, content })

      return res.status(201).json(comment)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  async update(req: Request<{ feed_id: string; id: string }, {}, FeedCommentInput>, res: Response) {
    try {
      const comment = await FeedComment.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean()

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" })
      }

      return res.json(comment)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  async destroy(req: Request, res: Response) {
    try {
      const comment = await FeedComment.findByIdAndDelete(req.params.id).lean()

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" })
      }

      return res.json(comment)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }
}

export default new Controller()
