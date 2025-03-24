const express = require('express');
const router = express.Router();

const service = require('../services/users');
const { checkJWT, isAdmin, isClient } = require('../middlewares/private');

router.post('/login', service.authenticate);

//Accès au tableau de bord admin
router.get('/administrateurs', (req, res, next) => {
    res.render('admin');
});
router.get('/admin-data', checkJWT, isAdmin, (req, res, next) => {
    res.json({ message: "Bienvenue dans votre tableau de bord administrateur"});
});

//Accès au tableau de bord client
router.get('/tableaudebord', checkJWT, isClient, (req, res, next) => {
    res.json({message : "Bienvenue !"});
});

router.get('/', service.getAll);
router.get('/:id', service.getById);
router.post('/', service.add);
router.patch('/:id', service.update);
router.delete('/:id', service.delete);

module.exports = router;