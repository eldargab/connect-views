var http = require('http')
var EE = require('events').EventEmitter

exports.Request = Request

function Request (app) {
    EE.call(this)
    var self = this
    this.data = []
    this.header = {}
    this.app = app
    if (!this.server) {
        this.server = http.Server(app)
        this.server.listen(0, function(){
            self.addr = self.server.address()
            self.listening = true
        })
    }
}

Request.prototype = Object.create(EE.prototype)

Request.prototype.get = function (path) {
    return this.request('GET', path)
}

Request.prototype.request = function (method, path) {
    this.method = method
    this.path = path
    return this
}

Request.prototype.set = function(field, val){
    this.header[field] = val
    return this
}

Request.prototype.expect = function(contentType, body){
    this.on('end', function(res){
        res.headers['content-type'].should.equal(contentType)
        if (body instanceof RegExp) {
            res.body.should.match(body)
        } else {
            res.body.should.equal(body)
        }
    })
}

Request.prototype.end = function(done){
    var self = this

    if (this.listening) {
        var req = http.request({
            method: this.method,
            port: this.addr.port,
            host: this.addr.address,
            path: this.path,
            headers: this.header
        })

        req.on('response', function(res){
            var buf = ''
            res.setEncoding('utf8')
            res.on('data', function(chunk){ buf += chunk })
            res.on('end', function(){
                res.body = buf
                self.emit('end', res)
                done()
            })
        })

        req.end()
    } else {
        this.server.on('listening', function(){
            self.end(done)
        })
    }
    return this
}