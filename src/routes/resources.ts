import {Router} from 'express';
import * as controller from '../controllers/resourceController';

const router = Router();

router.post('/', controller.create);     // Create
router.get('/', controller.list);        // List (filters)
router.get('/:id', controller.getById);  // Details
router.put('/:id', controller.update);   // Update
router.delete('/:id', controller.remove);// Delete

export default router;