import type { Request, Response } from 'express'
import type { LoginInput, RegisterInput } from './schema'
import bcrypt from 'bcrypt'
import { cookieOptions, generateToken } from './utils'
import { schema } from '../../lib/database'

class Controller {
  async login(req: Request<{}, {}, LoginInput>, res: Response) {
    const { email, password } = req.body

    const user = await schema.User.findOne({ email }).lean()

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(401).json({
        message: 'Invalid credentials',
      })
    }

    const token = generateToken(user._id.toString())

    res.cookie('token', token, cookieOptions)

    return res.status(200).json({
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  }

  async register(req: Request<{}, {}, RegisterInput>, res: Response) {
    const { name, username, email, password } = req.body

    const existUser = await schema.User.findOne({ email }).lean()

    if (existUser) {
      return res.status(409).json({
        message: 'User already exists',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await schema.User.create({
      name,
      username,
      email,
      password: hashedPassword,
    })

    const token = generateToken(user._id.toString())

    res.cookie('token', token, cookieOptions)

    return res.status(200).json({
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  }

  async logout(req: Request, res: Response) {
    res.cookie('token', '', { ...cookieOptions, maxAge: 1 })
    res.json({ message: 'Logged out successfully' })
  }

  async me(req: Request, res: Response) {
    res.json(req.user)
  }

  async updateMe(req: Request, res: Response) {
    const userId = (req.user as any)?._id || (req.user as any)?.id

    if (!userId) {
      return res.status(401).json({
          message:'Unauthorized'
        })
    }

    const { name, username, email } = req.body
    const updatedUser = await schema.User.findByIdAndUpdate(
      userId,
      { name,username,email },
      { new: true, runValidators: true }
    ).lean()

    if (!updatedUser) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    return res.status(200).json({
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    })

  }
}

export default new Controller()
