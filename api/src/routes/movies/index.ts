import { Router } from 'express'
import controller from './controller'

const router: Router = Router()

router.get('/:id', controller.detail)
router.get('/list', controller.list)
router.get('/search', controller.search)
router.get('/:id/credits', controller.credits)

export default router
