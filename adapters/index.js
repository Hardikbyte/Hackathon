const demo = require('./demo')

function getAdapter(name) {
  if (!name || name === 'demo') return demo
  throw new Error('Adapter not found: ' + name)
}

module.exports = { getAdapter }
