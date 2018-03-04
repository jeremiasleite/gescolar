var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/contas_receber', function(req, res, next) {
  res.render('financeiro/contasReceber/contasReceber', { title: 'Express' });
});

router.get('/contas_receber/novo', function(req, res, next) {
  res.render('financeiro/contasReceber/novoRecebimento', { title: 'Express' });
});
module.exports = router;