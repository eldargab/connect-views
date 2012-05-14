var Middleware = require('./middleware')
var PathHandler = require('./path-handler')

module.exports = function (opts) {
    opts = opts || {}
    return Middleware(opts.root, PathHandler(opts))
}