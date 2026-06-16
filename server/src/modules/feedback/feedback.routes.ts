import { Router } from 'express';
import { FeedbackController } from './feedback.controller';
import { verifyToken } from '../../middleware/auth';

const router = Router();

router.use(verifyToken);

router.post('/', FeedbackController.createRequest);
router.get('/open', FeedbackController.getOpenRequests);
router.get('/my-requests', FeedbackController.getMyRequests);
router.get('/my-feedback', FeedbackController.getMyFeedbackGiven);
router.get('/:id', FeedbackController.getRequest);
router.post('/:id/feedback', FeedbackController.submitFeedback);
router.post('/:id/close', FeedbackController.closeRequest);

export default router;
