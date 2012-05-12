var parseUrl = require('url').parse
var PATH = require('path')
var STATUS_CODES = require('http').STATUS_CODES
var fs = require('fs')

module.exports = function extensions (opts) {
    opts = opts || {}
    opts.root = opts.root || process.cwd()
    opts.exts = opts.exts || {}

    function Options (req, res, next) {
        this.req = req
        this.res = res
        this.next = next
    }

    Options.prototype = opts

    return function (req, res, next) {
        var path = decodeUri(parseUrl(req.url).pathname)

        if (path instanceof URIError) return next(error(400))

        if (~path.indexOf('\0')) return next(error(400))

        path = PATH.normalize(PATH.join(opts.root, path))

        if (0 != path.indexOf(opts.root)) return next(error(403))

        handle(path, new Options(req, res, next))
    }
}

function handle (path, opts) {
    debugger
    fs.stat(path, function (error, stat) {
        if (error && error.code != 'ENOENT') return opts.next(error)

        if (error && error.code == 'ENOENT') {
            lookupExts(path, Object.keys(opts.exts), function (err, file) {
                if (err) return opts.next(err)
                if (!file) return opts.next()
                handleFile(file, opts)
            })
            return
        }

        if (stat.isDirectory()) {
            handle(PATH.join(path, 'index'), opts)
            return
        }

        handleFile(path, opts)
    })
}

function handleFile (file, opts) {
    var ext = PATH.extname(file)
    var handler = opts.exts[ext]
    if (!handler) return opts.next()
    handler(file, opts.req, opts.res, opts)
}

function lookupExts (path, exts, cb) {
    var done = false
    var checked = 0

    function onstat (p) {
        return function statCb (error, stat) {
            if (done) return
            if (error && error.code != 'ENOENT') {
                done = true
                cb(error)
                return
            }
            if (error) {
                checked++
                if (checked == exts.length) return cb()
                return
            }
            done = true
            cb(null, p)
        }
    }

    exts.forEach(function (ext) {
        var p = path + ext
        fs.stat(p, onstat(p))
    })
}


function decodeUri (uri) {
    try {
        return decodeURIComponent(uri)
    }
    catch (e) {
        return e
    }
}

function error (code) {
    var err = new Error(STATUS_CODES[code])
    err.status = code
    return err
}