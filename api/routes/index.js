const express = require('express');
const router = express.Router();

const catwayRoute =require('../routes/catways');

//Route pour la page d'accueil
router.get('/', async (req, res) => {
  res.render('home');
});

//Route pour la documentation
router.get('/documentation', (req, res) => {
  res.render('documentation');
});

module.exports = router;
