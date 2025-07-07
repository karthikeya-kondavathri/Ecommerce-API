const db = require('../models/db')

// Get cart items for the logged-in user
exports.getCart = (req, res) => {
  const userId = req.user.id
  db.all(
    `
    SELECT cart.id, products.name, products.price, cart.quantity
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
    `,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json(rows)
    }
  )
}

// Add or update product in cart
exports.addToCart = (req, res) => {
  const userId = req.user.id
  const { product_id, quantity } = req.body

  db.get(
    'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
    [userId, product_id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message })

      if (row) {
        // update quantity
        db.run(
          'UPDATE cart SET quantity = ? WHERE id = ?',
          [quantity, row.id],
          function (err) {
            if (err) return res.status(500).json({ error: err.message })
            res.json({ message: 'Cart updated' })
          }
        )
      } else {
        // insert new
        db.run(
          'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
          [userId, product_id, quantity],
          function (err) {
            if (err) return res.status(500).json({ error: err.message })
            res.status(201).json({ message: 'Added to cart' })
          }
        )
      }
    }
  )
}

// Remove item from cart
exports.removeFromCart = (req, res) => {
  const userId = req.user.id
  const { product_id } = req.body

  db.run(
    'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
    [userId, product_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ message: 'Item removed from cart' })
    }
  )
}
