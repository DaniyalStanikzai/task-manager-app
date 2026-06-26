const router = require('express').Router();
const { isAuthenticated } = require('../../middleware/auth');
const projectController = require('../../controllers/projectController');

router.use(isAuthenticated);

router.get('/', projectController.index);
router.get('/new', projectController.showNew);
router.post('/', projectController.create);
router.get('/:id', projectController.show);
router.get('/:id/edit', projectController.showEdit);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.destroy);

module.exports = router;
