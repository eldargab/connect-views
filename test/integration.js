var express = require('express')
var Request = require('./support/http').Request
var Views = require('../lib')

describe('Integration tests', function () {
    beforeEach(function () {
        this.app = express()
        this.req = new Request(this.app)
    })

    function testEngine (name, options, fn) {
        if (typeof options == 'function') {
            fn = options
            options = {}
        }
        options.root = __dirname + '/fixtures/' + name.toLowerCase()
        it(name, function (done) {
            this.app.use(Views(options))
            fn(this.req, done)
        })
    }

    testEngine('Less', function (req, done) {
        req.get('/').expect('text/css', /header/, done)
    })

    testEngine('Markdown', function (req, done) {
        req.get('/hello').expect('text/html', /<h1>Hello<\/h1>/, done)
    })

    testEngine('Jade', {
        '*': {hello: 'hello'},
        'jade': {world: 'world'}
    }, function (req, done) {
        req.get('/hello').expect('text/html', /hello world/, done)
    })
})