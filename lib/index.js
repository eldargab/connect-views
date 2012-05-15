var Middleware = require('./middleware')
var Lookup = require('./path-lookup')
var Render = require('./render')
var engines = require('./engines')
var mix = require('./util').mix

module.exports = function (opts) {
    opts = opts || {}
    opts.root = opts.root || process.cwd()
    opts.pathHandler = opts.pathHandler || Render(function (ext) {
        return opts.engine
            ? opts.engine(ext)
            : engine(ext, opts)
    })
    return Middleware(opts.root, Lookup(function (path, req, res, next) {
        opts.pathHandler(path, req, res, next)
    }))
}

function engine (ext, opts) {
    var cach = engine.cach
    var eng = cach[ext]
    if (eng === undefined) {
        eng = cach[ext] = opts[ext] || engines(ext) || null
        if (eng) {
            var extName = ext.substring(1)
            mix(eng, {root: opts.root}, opts['*'], opts[extName])
        }
    }
    return eng ? Object.create(eng) : null
}

engine.cach = {}

module.exports.engine = engine
module.exports.engines = engines
module.exports.Render = Render