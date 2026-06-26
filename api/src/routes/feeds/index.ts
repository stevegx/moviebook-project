import { Router } from 'express'
import { Feed, Comment, Like } from './controllers'
import { validator, auth } from '@/middlewares'
import schema from './schema'

const router: Router = Router()

router.get('/', auth, Feed.index)
router.get('/:id', auth, Feed.show)
router.post('/', auth, validator(schema.feed.store), Feed.store)
router.patch('/:id', auth, validator(schema.feed.update), Feed.update)
router.delete('/:id', auth, Feed.destroy)

router.get('/:feed/likes/all', auth, Like.index)
router.get('/:feed/likes', auth, Like.show)
router.post('/:feed/likes', auth, Like.store)
router.delete('/:feed/likes/:id', auth, Like.destroy)

router.get('/:feed/comments', auth, Comment.index)
router.get('/:feed/comments/:id', auth, Comment.show)
router.post('/:feed/comments', auth, validator(schema.comment), Comment.store)
router.patch('/:feed/comments/:id', auth, validator(schema.comment), Comment.update)
router.delete('/:feed/comments/:id', auth, Comment.destroy)

export default router
