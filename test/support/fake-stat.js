var sinon = require('sinon')
var extname = require('path').extname
var normalize = require('path').normalize

module.exports = function (paths) {
    var stub = sinon.stub()
    stub.yields(FsError('ENOENT'))
    paths.forEach(function (p) {
        var stats = new Stat(!extname(p))
        stub.withArgs(normalize(p)).yields(null, stats)
    })
    return stub
}

function Stat (isDir) {
    this._isDir = isDir
}

Stat.prototype.isDirectory = function () {
    return !!this._isDir
}

function FsError (code) {
    var err = new Error
    err.code = code
    return err
}