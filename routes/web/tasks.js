const router = require('express').Router();
const { isAuthenticated } = require('../../middleware/auth');
const taskController = require('../../controllers/taskController');

router.use(isAuthenticated);

router.get('/new', taskController.showNew);
router.post('/', taskController.create);
router.get('/:id/edit', taskController.showEdit);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.destroy);

module.exports = router;
