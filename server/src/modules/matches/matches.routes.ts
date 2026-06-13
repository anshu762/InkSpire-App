import { Router } from 'express';
import { MatchesController } from './matches.controller';
import { verifyToken } from '../../middleware/auth';

const router = Router();

router.use(verifyToken);

router.post('/request', MatchesController.sendMatchRequest);
router.get('/', MatchesController.getMyMatches);
router.get('/requests', MatchesController.getMatchRequests);
router.post('/:id/accept', MatchesController.acceptRequest);
router.post('/:id/decline', MatchesController.declineRequest);
router.post('/:id/unmatch', MatchesController.unmatch);

export default router;
