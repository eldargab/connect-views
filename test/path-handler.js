var sinon = require('sinon')
var Fs = require('./support/fake-fs')
var Next = require('./support/next')
var Handler = require('../lib/path-handler')

function ExtHandler () {
    var spy = sinon.spy()

    spy.handles = function (file) {
        this.calledOnce.should.be.true
        this.calledWith(file).should.be.true
    }

    spy.options = function () {
        this.calledOnce.should.be.true
        return this.firstCall.args[1]
    }

    return spy
}

describe('Path handler', function () {
    var h, next, exts, fs, options, req, res

    beforeEach(function () {
        exts = {
            '.jade': ExtHandler(),
            '.md': ExtHandler()
        }
        fs = new Fs
        options = {
            exts: exts,
            fsStat: function (p, cb) { fs.stat(p, cb) },
            fsDir: function (p, cb) { fs.readdir(p, cb) },
            setting: 'setting'
        }
        h = Handler(options)
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

    function test (path) {
        h(path, req, res, next)
    }

    it('Should be able to determine file extension and handler', function () {
        test('root/article')
        next.notCalled()
        exts['.md'].handles('root/article.md')
    })

    it('Should serve exact paths', function () {
        test('root/article.md')
        next.notCalled()
        exts['.md'].handles('root/article.md')
    })

    it('Should use `*` as a default handler', function () {
        exts['*'] = ExtHandler()
        test('root/index.html')
        next.notCalled()
        exts['*'].handles('root/index.html')
    })

    it('Should pass filename, req, res, next and passed settings to handler', function () {
        test('root/article')
        exts['.md'].handles('root/article.md')
        var opts = exts['.md'].options()
        opts.req.should.equal(req)
        opts.res.should.equal(res)
        opts.next.should.equal(next)
        opts.setting.should.equal(options.setting)

    })

    it('Should support index files in dirs', function () {
        test('root/dir')
        next.notCalled()
        exts['.jade'].handles('root/dir/index.jade')
    })

    it('Should pass control to next middleware on non-existent path', function () {
        test('non-existent/path')
        next.nextMiddleware()
    })

    it('Should pass control to next middleware when no appropriate file found', function () {
        test('root/hello')
        next.nextMiddleware()
    })

    it('Should pass control to next middleware when handler not found', function () {
        test('root/index.html')
        next.nextMiddleware()
    })

    it('Should pass fs.stat errors to next middleware', function () {
        var stat = sinon.stub(fs, 'stat')
        var error = new Error
        stat.withArgs('error').yields(error)
        test('error')
        debugger
        next.calledWithExactly(error).should.be.true
    })

    it('Should pass fs.readdir errors to next middleware', function () {
        fs.paths('readdir/error')
        var readdir = sinon.stub(fs, 'readdir')
        var error = new Error
        readdir.withArgs('readdir/error').yields(error)
        test('readdir/error')
        next.calledWithExactly(error).should.be.true
    })
})