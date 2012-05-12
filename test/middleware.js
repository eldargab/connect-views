var chai = require('chai')
chai.use(require('sinon-chai'))
chai.should()
var sinon = require('sinon')
var fs = require('fs')
var statNative = fs.stat
var FakeStat = require('./support/fake-stat')
var Middleware = require('../lib/middleware')

function Next () {
    var spy = sinon.spy()

    spy.nextMiddleware = function () {
        this.should.have.been.calledWithExactly()
    }

    spy.error = function (code) {
        var arg = this.firstCall.args[0]
        arg.should.be.an.instanceof(Error)
        arg.status.should.equal(code)
    }

    spy.notCalled = function () {
        this.should.not.have.been.called
    }

    return spy
}


describe('Middleware', function () {
    var m, next, exts, req, res, options

    afterEach(function () {
        fs.stat = statNative
    })

    beforeEach(function () {
        exts = {
            '.jade': sinon.spy(),
            '.md': sinon.spy()
        }
        m = Middleware({
            root: 'root',
            exts: exts,
            option: 'option'
        })
        fs.stat = FakeStat([
            'root/',
            'root/index.jade',
            'root/article.md',
            'root/path with spaces.md',
            'root/subdir/doc.jade'
        ])
        next = Next()
        req = {}
        res = {}
    })

    function test (url) {
        req.url = url
        m(req, res, next)
    }

    it('Should pass control to next middleware on non-existent path', function () {
        test('/non-existent/path')
        next.nextMiddleware()
    })

    it('Should be able to determine file extension and handler', function () {
        test('/article')
        next.notCalled()
        exts['.md'].should.have.been.calledWith('root/article.md')
    })

    it('Should pass filename, req, res, and passed options to handler', function () {
        test('/article')
        exts['.md'].should.have.been.calledWith('root/article.md', req, res)
        var options = exts['.md'].firstCall.args[3]
        options.option.should.equal('option')
    })

    it('Should support index files in dirs', function () {
        test('/')
        next.notCalled()
        exts['.jade'].should.have.been.calledWith('root/index.jade')
    })

    it('Should support urlencoded paths', function () {
        test('/path%20with%20spaces.md')
        next.notCalled()
        exts['.md'].should.have.been.calledWith('root/path with spaces.md')
    })

    it('Should respond with 403 Forbidden when traversing root', function () {
        test('/malicious/%2e%2e/%2e%2e/path')
        next.error(403)
    })

    it('Should pass fs.stat errors to next middleware', function () {
        var error = new Error
        fs.stat.withArgs('root/runtime/error').yields(error)
        test('/runtime/error')
        next.should.have.been.calledWithExactly(error)
    })
})