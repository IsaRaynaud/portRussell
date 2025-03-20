const express = require('express');
const router = express.Router();

const service = require('../services/users');

const { checkJWT, isAdmin } = require('../middlewares/private');

router.get('/', service.getAll);
router.get('/:id', service.getById);
router.post('/', service.add);
router.patch('/:id', service.update);
router.delete('/:id', service.delete);
router.post('/login', service.authenticate);

router.get('/administrateurs', checkJWT, isAdmin, (req, res, next) => {
    res.json({message : "Bienvenue Admin !"});
});

module.exports = router;