const express = require('express');
const router = express.Router();

const service = require('../services/users');

const { checkJWT, isAdmin} = require('../middleware/private');

router.get('/:id', service.getById);
router.put('/add', service.add);
router.patch('/:id', service.update);
router.delete('/:id', service.delete);
router.post('/login', service.authenticate);

router.get('/administrateurs', checkJWT, isAdmin, (req, res, next) => {
    res.json({message : "Bienvenue Admin !"});
});

module.exports = router;