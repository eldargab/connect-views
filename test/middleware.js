var sinon = require('sinon')
var Next = require('./support/next')
var Middleware = require('../lib/middleware')

describe('Middleware', function () {
    var m, next, req, res, handler

    beforeEach(function () {
        handler = sinon.spy()
        m = Middleware('root', handler)
        next = Next()
        req = {}
        res = {}
    })

    function test (url) {
        req.url = url
        m(req, res, next)
    }

    it('Should pass path, req, res and next to handler', function () {
        test('/article')
        handler.calledWithExactly('root/article', req, res, next).should.be.true
    })

    it('Should support urlencoded paths', function () {
        test('/path%20with%20spaces.md')
        handler.calledWith('root/path with spaces.md')
    })

    it('Should respond with 403 Forbidden when traversing root', function () {
        test('/malicious/%2e%2e/%2e%2e/path')
        next.error(403)
        handler.called.should.be.false
    })
})