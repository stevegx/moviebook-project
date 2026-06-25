import type { Request, Response } from 'express'
import type { UserInformationInput, UserPasswordInput } from './schema'
import { schema } from '@/lib/database'
import bcrypt from 'bcrypt'

class Controller {
  async me(req: Request, res: Response) {
    res.json(req.user)
  }

  async information(req: Request<{}, {}, UserInformationInput>, res: Response) {
    const user = await schema.User.findByIdAndUpdate(req.user.id, req.body).lean()

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    return res.status(200).json({
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  }

  async password(req: Request<{}, {}, UserPasswordInput>, res: Response) {
    const user = await schema.User.findById(req.user.id).select('+password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    const validPassword = await bcrypt.compare(req.user.password, user.password)

    if (!validPassword) {
      return res.status(401).json({
        message: 'Invalid password'
      })
    }

    const password = await bcrypt.hash(req.body.password, 10)
    user.password = password
    await user.save()

    return res.status(200).json({
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  }
}

export default new Controller()
