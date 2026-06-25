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

router.get('/:feed_id/likes/all', auth, Like.index)
router.get('/:feed_id/likes', auth, Like.show)
router.post('/:feed_id/likes', auth, Like.store)
router.delete('/:feed_id/likes/:id', auth, Like.destroy)

router.get('/:feed_id/comments', auth, Comment.index)
router.get('/:feed_id/comments/:id', auth, Comment.show)
router.post('/:feed_id/comments', auth, validator(schema.comment), Comment.store)
router.patch('/:feed_id/comments/:id', auth, validator(schema.comment), Comment.update)
router.delete('/:feed_id/comments/:id', auth, Comment.destroy)

export default router
