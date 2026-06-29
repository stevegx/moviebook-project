import type { Request, Response } from 'express'
import { MovieComment } from '@/lib/database/schema'
import type { MovieCommentInput } from '../schema'

class Controller {
  async index(req: Request, res: Response) {
    try {
      const page = Math.max(1, parseInt(String(req.query.page || '1'), 10))
      const limit = Math.max(1, parseInt(String(req.query.limit || '10'), 10))
      const comments = await MovieComment.find({ movie: req.params.movie as string }).populate('user', '-password').lean()
      
      const buildCommentTree = (comments: any[]): any[] => {
        const commentMap = new Map(comments.map(c => [c._id.toString(), { ...c, replies: [] }]))
        const rootComments: any[] = []

        comments.forEach((comment: any) => {
          const mappedComment = commentMap.get(comment._id.toString())
          const parentId = comment.parent?.toString()
          const parentComment = parentId ? commentMap.get(parentId) : null

          if (parentComment) {
            parentComment.replies.push(mappedComment)
          } else {
            rootComments.push(mappedComment)
          }
        })

        return rootComments
      }

      const treeComments = buildCommentTree(comments)
      const total = treeComments.length
      const totalPages = Math.ceil(total / limit)
      const start = (page - 1) * limit
      const data = treeComments.slice(start, start + limit)

      return res.json({
        data,
        page,
        limit,
        total,
        total_pages: totalPages,
      })
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  async show(req: Request, res: Response) {
    try {
      const comment = await MovieComment.findById(req.params.id).lean()

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" })
      }

      return res.json(comment)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  async store(req: Request<{ movie: string }, {}, MovieCommentInput>, res: Response) {
    try {
      const comment = await MovieComment.create({
        user: req.user.id,
        movie: req.params.movie,
        content: req.body.content,
        parent: req.body.parent || null
      })

      const populatedComment = await comment.populate('user', '-password')

      return res.status(201).json(populatedComment)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  async update(req: Request<{ id: string }, {}, MovieCommentInput>, res: Response) {
    try {
      const comment = await MovieComment.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean()

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
      const comment = await MovieComment.findByIdAndDelete(req.params.id).lean()

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
