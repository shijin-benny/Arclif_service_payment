const router = require('express').Router();
const cart = require('../controller/carthelper');

router.get('/cartview/:id', cart.cartview);

module.exports = router;