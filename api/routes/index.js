const express = require('express');
const router = express.Router();

const catwayRoute =require('../routes/catways');

/* GET home page. */
router.get('/', async (req, res) => {
  res.render('index', { 
    title: 'Accueil'
  })
});

router.use('/catways', catwayRoute);

module.exports = router;
