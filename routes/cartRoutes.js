const express = require('express')
const router = express.Router()
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController')
const { authenticate } = require('../middleware/authMiddleware')

router.get('/', authenticate, getCart)
router.post('/', authenticate, addToCart)
router.delete('/', authenticate, removeFromCart)

module.exports = router
