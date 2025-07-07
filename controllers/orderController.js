const db = require('../models/db')

// Place order from cart
exports.placeOrder = (req, res) => {
  const userId = req.user.id

  // Step 1: Get all cart items for the user
  db.all(
    'SELECT * FROM cart WHERE user_id = ?',
    [userId],
    (err, cartItems) => {
      if (err) return res.status(500).json({ error: err.message })
      if (cartItems.length === 0) return res.status(400).json({ error: 'Cart is empty' })

      // Step 2: Insert each cart item into orders
      const stmt = db.prepare('INSERT INTO orders (user_id, product_id, quantity) VALUES (?, ?, ?)')

      cartItems.forEach(item => {
        stmt.run([userId, item.product_id, item.quantity])
      })

      stmt.finalize(err => {
        if (err) return res.status(500).json({ error: err.message })

        // Step 3: Clear the cart after placing order
        db.run('DELETE FROM cart WHERE user_id = ?', [userId], err => {
          if (err) return res.status(500).json({ error: err.message })
          res.json({ message: 'Order placed successfully' })
        })
      })
    }
  )
}

// View orders for a user
exports.getOrders = (req, res) => {
  const userId = req.user.id

  db.all(
    `
    SELECT orders.id, products.name, orders.quantity, orders.created_at
    FROM orders
    JOIN products ON orders.product_id = products.id
    WHERE orders.user_id = ?
    ORDER BY orders.created_at DESC
    `,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json(rows)
    }
  )
}
