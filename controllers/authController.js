const db = require('../models/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET || 'secret'

exports.register = async (req, res) => {
  const { username, password, role = 'customer' } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  db.run(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    [username, hashedPassword, role],
    function (err) {
      if (err) {
        return res.status(400).json({ error: 'Username already taken' })
      }
      res.status(201).json({ message: 'User registered successfully' })
    }
  )
}

exports.login = (req, res) => {
  const { username, password } = req.body

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({ token })
  })
}
