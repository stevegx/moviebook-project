import type { Request, Response } from 'express'
import { Movie } from '../services/index.js'

class Controller {
  async list(req: Request, res: Response) {
    const type = (req.query.type as string) || 'now_playing'
    const page = (req.query.page as string) || '1'

    try {
      const data = await Movie.list(type, page)

      return res.json(data)
    } catch (error) {
      console.error(error)
      return res.status(502).json({ message: 'Could not load movies from TMDB' })
    }
  }

  async search(req: Request, res: Response) {
    const query = req.query.query as string
    const page = (req.query.page as string) || '1'

    try {
      const data = await Movie.search(query, page)

      return res.json(data)
    } catch (error) {
      console.error(error)
      return res.status(502).json({ message: 'Could not load movies from TMDB' })
    }
  }

  async detail(req: Request, res: Response) {
    try {
      const data = await Movie.detail(req.params.id as string)

      return res.json(data)
    } catch (error) {
      console.error(error)
      return res.status(502).json({ message: 'Could not load movies from TMDB' })
    }
  }

  async trailer(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params
    if (!/^[1-9]\d{0,9}$/.test(id) || Number(id) > 2147483647) {
      return res.status(400).json({ message: 'Invalid movie ID' })
    }
    try {
      return res.json(await Movie.trailer(id))
    } catch (error) {
      console.error(error)
      return res.status(502).json({ message: 'Could not load the trailer from TMDB' })
    }
  }

  async credits(req: Request, res: Response) {
    try {
      const data = await Movie.credits(req.params.id as string)

      return res.json(data)
    } catch (error) {
      console.error(error)
      return res.status(502).json({ message: 'Could not load movies from TMDB' })
    }
  }
}

export default new Controller()
