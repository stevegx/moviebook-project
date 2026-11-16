import { Router } from 'express'
import { validator, auth } from '../../middlewares/index.js'
import schema from './schema.js'
import controller from './controller.js'

const router: Router = Router()

router.post('/login', validator(schema.login), controller.login)
router.post('/register', validator(schema.register), controller.register)
router.post('/logout', auth, controller.logout)

export default router
