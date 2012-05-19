var sinon = require('sinon')
var Fs = require('./support/fake-fs')
var Next = require('./support/next')
var Onpath = require('./support/onpath')
var Lookup = require('../lib/path-lookup')

describe('Path handler', function () {
    var lookup, next, fs, req, res, h, options

    function test (path) {
        lookup(path, req, res, next)
    }

    beforeEach(function () {
        fs = new Fs
        options = {
            fsStat: function (p, cb) { fs.stat(p, cb) },
            fsDir: function (p, cb) { fs.readdir(p, cb) },
        }
        h = Onpath()
        lookup = Lookup(h, options)
        next = Next()
        req = {}
        res = {}
        fs.paths('root', [
            'article.md',
            'doc.jade',
            'index.html',
            'dir/index.jade'
        ])
    })

    it('Should be able to lookup file extension', function () {
        test('root/article')
        next.notCalled()
        h.handles('root/article.md')
    })

    it('Should serve exact paths', function () {
        test('root/article.md')
        next.notCalled()
        h.handles('root/article.md')
    })

    it('Should pass filename, req, res, next to the handler', function () {
        test('root/article')
        h.arg(1).should.equal(req)
        h.arg(2).should.equal(res)
        h.arg(3).should.equal(next)
    })

    it('Should support index files for dirs', function () {
        test('root/dir')
        next.notCalled()
        h.handles('root/dir/index.jade')
    })

    it('Should pass control to next middleware on non-existent path', function () {
        test('non-existent/path')
        next.nextMiddleware()
        h.notCalled()
    })

    it('Should pass control to next middleware when no appropriate file found', function () {
        test('root/hello')
        next.nextMiddleware()
        h.notCalled()
    })

    it('Should pass fs.stat errors to next middleware', function () {
        var stat = sinon.stub(fs, 'stat')
        var error = new Error
        stat.withArgs('error').yields(error)
        test('error')
        next.calledWithExactly(error).should.be.true
        h.notCalled()
    })

    it('Should pass fs.readdir errors to next middleware', function () {
        fs.paths('readdir/error')
        var readdir = sinon.stub(fs, 'readdir')
        var error = new Error
        readdir.withArgs('readdir/error').yields(error)
        readdir.withArgs('readdir\\error').yields(error)
        test('readdir/error')
        next.calledWithExactly(error).should.be.true
        h.notCalled()
    })
})