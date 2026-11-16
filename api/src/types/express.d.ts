export interface AuthenticatedUser {
  id: string
  name: string
  username: string
  email: string
  createdAt: Date
  updatedAt: Date
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
    }
  }
}
