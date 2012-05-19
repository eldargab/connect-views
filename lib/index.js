var mix = require('./util').mix

module.exports = Views

Views.engines = require('./engines')
Views.Render = require('./render')
Views.Middleware = require('./middleware')
Views.PathLookup = require('./path-lookup')

function Views (opts) {
    opts = opts || {}
    opts.root = opts.root || process.cwd()
    opts.pathHandler = opts.pathHandler || Views.Render(function (ext) {
        return opts.engine
            ? opts.engine(ext)
            : Views.engine(ext, opts)
    })
    return Views.Middleware(opts.root, Views.PathLookup(function (path, req, res, next) {
        opts.pathHandler(path, req, res, next)
    }))
}

Views.engine = function engine (ext, opts) {
    var cache = engine.cache
    var eng = cache[ext]
    if (eng === undefined) {
        eng = cache[ext] = opts[ext] || Views.engines(ext) || null
        if (eng) {
            var extName = ext.substring(1)
            mix(eng, {root: opts.root}, opts['*'], opts[extName])
        }
    }
    return eng ? Object.create(eng) : null
}

Views.engine.cache = {}

