import { Router } from 'express';
import { blogController } from '../controllers/blogController';
import { adminAuth } from '../middleware/adminAuth';

const router = Router();

/**
 * Public blog routes
 */
router.get('/', blogController.getAllBlogs);
router.get('/slug/:slug', blogController.getBlogBySlug);
router.get('/:id', blogController.getBlogById);

/**
 * Admin blog management routes
 */
router.post('/', adminAuth, blogController.createBlog);
router.put('/:id', adminAuth, blogController.updateBlog);
router.delete('/:id', adminAuth, blogController.deleteBlog);
router.get('/admin/my-blogs', adminAuth, blogController.getAdminBlogs);

export default router;
