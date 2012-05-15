var onerror = require('./util').nextOnENOENT
var extname = require('path').extname
var fs = require('fs')

module.exports = function (Engine) {
    return function render (file, req, res, next) {
        var engine = Engine(extname(file))
        if (engine && engine.renderFile) {
            engine.renderFile(file, function (error, out) {
                if (error) return onerror(error, next)
                res.set('Content-Type', engine.contentType)
                res.send(out)
            })
        } else if (engine && engine.render) {
            fs.readFile(file, 'utf8', function (error, string) {
                if (error) return onerror(error, next)
                engine.render(string, function (error, out) {
                    if (error) return next(error)
                    res.set('Content-Type', engine.contentType)
                    res.send(out)
                })
            })
        } else {
            res.sendfile(file)
        }
    }
}