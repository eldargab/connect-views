var N = require('path').normalize
var sinon = require('sinon')
var should = require('should')

module.exports = function () {
    var spy = sinon.spy()

    spy.handles = function (file) {
        this.calledOnce.should.be.true

        var args = this.firstCall.args
        should.exist(args[0])
        var actual = N(args[0])
        var expected = N(file)
        actual.should.equal(expected)
    }

    spy.arg = function (i) {
        return this.firstCall.args[i]
    }

    spy.notCalled = function () {
        this.called.should.be.false
    }

    return spy
}