var parseUrl = require('url').parse
var PATH = require('path')
var error = require('./http-error')

module.exports = function (root, handle) {
    if (typeof root == 'function') {
        handler = root
        root = null
    }
    root = root || process.cwd()

    return function fileHandler (req, res, next) {
        var path = decodeUri(parseUrl(req.url).pathname)

        if (path instanceof URIError) return next(error(400))

        if (~path.indexOf('\0')) return next(error(400))

        path = PATH.normalize(PATH.join(root, path))

        if (0 != path.indexOf(root)) return next(error(403))

        handle(path, req, res, next)
    }
}

function decodeUri (uri) {
    try {
        return decodeURIComponent(uri)
    }
    catch (e) {
        return e
    }
}