import { Router } from 'express'
import controller from './controller.js'
import { auth, validator } from '../../middlewares/index.js'
import schema from './schema.js'

const router: Router = Router()

router.get('/', auth, controller.me)
router.patch('/:id/information', auth, validator(schema.user.information), controller.information)
router.put('/:id/password', auth, validator(schema.user.password), controller.password)

export default router
