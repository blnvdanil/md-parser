
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./md-parser.cjs.production.min.js')
} else {
  module.exports = require('./md-parser.cjs.development.js')
}
