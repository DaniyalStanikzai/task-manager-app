const router = require('express').Router();
const { verifyJWT } = require('../../middleware/auth');
const taskController = require('../../controllers/taskController');

router.use(verifyJWT);

router.post('/', taskController.apiCreate);
router.put('/:id', taskController.apiUpdate);
router.delete('/:id', taskController.apiDestroy);

module.exports = router;
