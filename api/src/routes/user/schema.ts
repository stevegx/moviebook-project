import { z } from 'zod'

const userInformationUpdate = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long.').optional(),
    username: z.string().min(3, 'Username must be at least 3 characters long.').optional(),
    email: z.string().email('Invalid email format.').optional(),
  })
})

const userPasswordUpdate = z.object({
  body: z.object({
    password: z.string().min(8, 'Password must be at least 8 characters long.'),
    password_confirmation: z.string().min(8, 'Confirmation password must be at least 8 characters long.'),
  }).refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match.',
    path: ['password_confirmation']
  })
})

export type UserInformationInput = z.infer<typeof userInformationUpdate>['body']
export type UserPasswordInput = z.infer<typeof userPasswordUpdate>['body']

const schema = {
  user: {
    information: userInformationUpdate,
    password: userPasswordUpdate,
  }
}

export default schema
