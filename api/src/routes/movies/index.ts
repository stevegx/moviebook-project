import { Router } from 'express'
import controller from './controller'

const router: Router = Router()

router.get('/list', controller.index)

export default router
