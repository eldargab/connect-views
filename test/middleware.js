var sinon = require('sinon')
var Next = require('./support/next')
var Onpath = require('./support/onpath')
var Middleware = require('../lib/middleware')

describe('Middleware', function () {
    var m, next, req, res, onpath

    beforeEach(function () {
        onpath = Onpath()
        m = Middleware('root', onpath)
        next = Next()
        req = { method: 'GET'}
        res = {}
    })

    function test (url) {
        req.url = url
        m(req, res, next)
    }

    it('Should pass path, req, res and next to the handler', function () {
        test('/article')
        onpath.handles('root/article')
        onpath.arg(1).should.equal(req)
        onpath.arg(2).should.equal(res)
        onpath.arg(3).should.equal(next)
    })

    it('Should support urlencoded paths', function () {
        test('/path%20with%20spaces.md')
        onpath.handles('root/path with spaces.md')
    })

    it('Should respond with 403 Forbidden when traversing root', function () {
        test('/malicious/%2e%2e/%2e%2e/path')
        next.error(403)
        onpath.notCalled()
    })
})