const router = require('express').Router();
const { verifyJWT } = require('../../middleware/auth');
const projectController = require('../../controllers/projectController');

router.use(verifyJWT);

router.get('/', projectController.apiIndex);
router.post('/', projectController.apiCreate);
router.get('/:id', projectController.apiShow);
router.put('/:id', projectController.apiUpdate);
router.delete('/:id', projectController.apiDestroy);

module.exports = router;
