var onerror = require('./util').nextOnENOENT
var extname = require('path').extname
var fs = require('fs')
var mime = require('mime')

module.exports = function (Engine) {
    return function render (file, req, res, next) {
        var engine = Engine(extname(file))
        if (engine && engine.renderFile) {
            engine.renderFile(file, function (error, out) {
                if (error) return onerror(error, next)
                send(out, engine.contentType)
            })
        } else {
            fs.readFile(file, 'utf8', function (error, string) {
                if (error) return onerror(error, next)
                if (engine) {
                    engine.render(string, function (error, out) {
                        if (error) return next(error)
                        send(out, engine.contentType)
                    })
                } else {
                    send(string, mime.lookup(file))
                }
            })
        }

        function send (str, contentType) {
            res.charset = mime.charsets.lookup(contentType) || 'utf-8'
            res.setHeader('Content-Type', contentType)
            res.setHeader('Content-Length', Buffer.byteLength(str))
            res.end(req.method == 'HEAD' ? null : str)
        }
    }
}