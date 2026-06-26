import { Router } from 'express'
import controller from './controller'
import { auth, validator } from '@/middlewares'
import schema from './schema'

const router: Router = Router()

router.get('/', auth, controller.me)
router.patch('/:id/information', auth, validator(schema.user.information), controller.information)
router.put('/:id/password', auth, validator(schema.user.password), controller.password)

export default router
