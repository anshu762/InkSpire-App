import { Router } from 'express';
import { NotificationsController } from './notifications.controller';
import { verifyToken } from '../../middleware/auth';

const router = Router();

router.use(verifyToken);

router.get('/', NotificationsController.getNotifications);
router.get('/unread-count', NotificationsController.getUnreadCount);
router.patch('/mark-all-read', NotificationsController.markAllRead);
router.patch('/:id/read', NotificationsController.markRead);

export default router;
