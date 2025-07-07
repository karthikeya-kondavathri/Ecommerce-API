const express = require('express')
const router = express.Router()
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController')

const { authenticate, authorize } = require('../middleware/authMiddleware')

// Public
router.get('/', getProducts)

// Admin only
router.post('/', authenticate, authorize('admin'), createProduct)
router.put('/:id', authenticate, authorize('admin'), updateProduct)
router.delete('/:id', authenticate, authorize('admin'), deleteProduct)

module.exports = router
