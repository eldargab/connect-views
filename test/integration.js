var express = require('express')
var Request = require('./support/http').Request
var Views = require('../lib')

function testEngine (name, fn) {
    it(name, function (done) {
        var app = express()
        var req = new Request(app)
        var opts = {}
        opts.root = __dirname + '/fixtures/' + name.toLowerCase()
        fn(req, opts)
        app.use(Views(opts))
        req.end(done)
    })
}

describe('Integration tests', function () {
    testEngine('Less', function (req, opts) {
        opts.less = {
            paths: [opts.root + '/subdir']
        }
        req.get('/').expect('text/css; charset=UTF-8', /header/)
    })

    testEngine('Stylus', function (req, opts) {
        opts.styl = {
            paths: [opts.root + '/subdir']
        }
        req.get('/').expect('text/css; charset=UTF-8', /header/)
    })

    testEngine('Markdown', function (req) {
        req.get('/hello').expect('text/html; charset=UTF-8', /<h1>Hello<\/h1>/)
    })

    testEngine('Jade', function (req, opts) {
        opts['*'] = {hello: 'hello'}
        opts['jade'] = {world: 'world'}
        req.get('/hello').expect('text/html; charset=UTF-8', /hello world/)
    })
})