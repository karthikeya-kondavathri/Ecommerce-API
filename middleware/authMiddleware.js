const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET || 'secret'

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'No token provided' })

  const token = authHeader.split(' ')[1]
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' })
    req.user = user
    next()
  })
}

const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Access denied' })
    }
    next()
  }
}

module.exports = { authenticate, authorize }
