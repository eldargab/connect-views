var fs = require('fs')
var PATH = require('path')

module.exports = function (onfile, opts) {
    opts = opts || {}
    var fsStat = opts.fsStat || fs.stat
    var readdir = opts.fsDir || fs.readdir

    function lookup (path, cb) {
        var dir = PATH.dirname(path)
        var basename = PATH.basename(path)
        readdir(dir, function (error, files) {
            if (error) return cb(error)
            cb(null, files.filter(function (file) {
                return basename == PATH.basename(file, PATH.extname(file))
            }).map(function (file) {
                return PATH.join(dir, file)
            }))
        })
    }

    return function handle (path, req, res, next) {
        fsStat(path, function (error, stat) {
            if (error && error.code != 'ENOENT') return next(error)
            if (error) {
                lookup(path, function (error, files) {
                    if (error && error.code != 'ENOENT') return next(error)
                    if (error) return next()
                    if (files.length == 0) return next()
                    if (files.length > 1) return next() // TODO: Respond with 300?
                    onfile(files[0], req, res, next)
                })
            } else if (stat.isDirectory()) {
                handle(PATH.join(path, 'index'), req, res, next)
            } else {
                onfile(path, req, res, next)
            }
        })
    }
}