var sinon = require('sinon')

module.exports = function Next () {
    var spy = sinon.spy()

    spy.nextMiddleware = function () {
        this.calledWithExactly().should.be.true
    }

    spy.error = function (code) {
        var arg = this.firstCall.args[0]
        arg.should.be.an.instanceof(Error)
        arg.status.should.equal(code)
    }

    spy.notCalled = function () {
        this.called.should.be.false
    }

    return spy
}