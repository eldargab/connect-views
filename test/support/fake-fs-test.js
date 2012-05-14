var should = require('should')
var sinon = require('sinon')
var Fs = require('./fake-fs')

function Cb () {
    var spy = sinon.spy()

    spy.error = function (err) {
        this.calledOnce.should.be.true
        this.firstCall.args[0].code.should.equal(err)
    }

    spy.result = function () {
        this.calledOnce.should.be.true
        return this.firstCall.args[1]
    }

    return spy
}

describe('Fake FS', function () {
    var fs, cb

    beforeEach(function () {
        fs = new Fs
        cb = Cb()
    })

    it('Should treat paths with extensions as files', function () {
        fs.paths('this/is/a/file.txt').stat('this/is/a/file.txt', cb)
        cb.result().isDirectory().should.be.false
    })

    it('Should treat paths without extensions as dirs', function () {
        fs.paths('this.is.a/dir').stat('this.is.a/dir', cb)
        cb.result().isDirectory().should.be.true
    })

    it('Paths specifications should work like mkdir -p', function () {
        fs.paths('a/b/d').stat('a/b', cb)
        cb.result().isDirectory().should.be.true
    })

    it('Should not overwrite already existent dirs', function () {
        fs.paths('a/b/c').paths('a/b/d').readdir('a/b', cb)
        cb.result().should.eql(['c', 'd'])
    })

    it('Supports (dir, items) paths specification', function () {
        fs.paths('a', ['b', 'c', 'd/e']).readdir('a', cb)
        cb.result().should.eql(['b', 'c', 'd'])
    })

    it('stat() should return ENOENT on non-existent path', function () {
        fs.stat('non-existent', cb)
        cb.error('ENOENT')
    })

    it('readdir() should return ENOENT on non-existent path', function () {
        fs.stat('non-existent', cb)
        cb.error('ENOENT')
    })

    it('readdir() should return ENOTDIR on non directory', function () {
        fs.paths('file.txt').readdir('file.txt', cb)
        cb.error('ENOTDIR')
    })
})