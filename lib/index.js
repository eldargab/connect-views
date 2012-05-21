var mix = require('./util').mix

module.exports = Views

Views.engines = require('./engines')
Views.Render = require('./render')
Views.Middleware = require('./middleware')
Views.PathLookup = require('./path-lookup')

function Views (opts) {
    opts = opts || {}
    opts.root = opts.root || process.cwd()

    opts.engine = opts.engine || function (ext) {
        return Views.engine(ext, opts)
    }

    opts.render = opts.render || Views.Render(function (ext) {
        return opts.engine(ext)
    })

    opts.pathHandler = opts.pathHandler || Views.PathLookup(function (path, req, res, next) {
        opts.render(path, req, res, next)
    })

    return Views.Middleware(opts.root, function (path, req, res, next) {
        opts.pathHandler(path, req, res, next)
    })
}

Views.engine = function engine (ext, opts) {
    var cache = engine.cache
    var eng = cache[ext]
    if (eng === undefined) {
        eng = cache[ext] = opts[ext] || Views.engines(ext) || null
        if (eng) {
            var extName = ext.substring(1)
            mix(eng, {__root: opts.root}, opts['*'], opts[extName])
        }
    }
    return eng ? Object.create(eng) : null
}

Views.engine.cache = {}

