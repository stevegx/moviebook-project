import type { Request, Response } from 'express'
import movie from './service'

class Controller {
  async list(req: Request, res: Response) {
    const type = (req.query.type as string) || 'now_playing'
    const page = (req.query.page as string) || '1'

    try {
      const data = await movie.list(type, page)

      return res.json(data)
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  async search(req: Request, res: Response) {
    const query = req.query.query as string
    const page = (req.query.page as string) || '1'

    try {
      const data = await movie.search(query, page)

      return res.json(data)
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  async detail(req: Request, res: Response) {
    try {
      const data = await movie.detail(req.params.id as string)

      return res.json(data)
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  async credits(req: Request, res: Response) {
    try {
      const data = await movie.credits(req.params.id as string)

      return res.json(data)
    } catch (error) {
      return res.status(500).json(error)
    }
  }
}

export default new Controller()
