const express = require('express');
const router = express.Router();

const service = require('../services/catways');
const { checkJWT, isAdmin, isClient } = require('../middlewares/private');

router.use(checkJWT, isClient)

router.get('/', service.get);
router.get('/:catwayNumber', service.getById);
router.post('/', isAdmin, service.add);
router.put('/:catwayNumber', isAdmin, service.updateAll);
router.patch('/:catwayNumber', isAdmin, service.update);
router.delete('/:catwayNumber', isAdmin, service.delete);

module.exports = router;
