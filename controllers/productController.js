const db = require('../models/db')

// Get all products (public)
exports.getProducts = (req, res) => {
  const { name, category } = req.query
  let query = 'SELECT * FROM products WHERE 1=1'
  const params = []

  if (name) {
    query += ' AND name LIKE ?'
    params.push(`%${name}%`)
  }

  if (category) {
    query += ' AND category LIKE ?'
    params.push(`%${category}%`)
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
}

// Add product (admin only)
exports.createProduct = (req, res) => {
  const { name, description, price, category } = req.body
  db.run(
    `INSERT INTO products (name, description, price, category)
     VALUES (?, ?, ?, ?)`,
    [name, description, price, category],
    function (err) {
      if (err) return res.status(500).json({ error: err.message })
      res.status(201).json({ id: this.lastID, message: 'Product added' })
    }
  )
}

// Update product (admin only)
exports.updateProduct = (req, res) => {
  const { id } = req.params
  const { name, description, price, category } = req.body
  db.run(
    `UPDATE products SET name=?, description=?, price=?, category=? WHERE id=?`,
    [name, description, price, category, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ message: 'Product updated' })
    }
  )
}

// Delete product (admin only)
exports.deleteProduct = (req, res) => {
  const { id } = req.params
  db.run(`DELETE FROM products WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ message: 'Product deleted' })
  })
}
