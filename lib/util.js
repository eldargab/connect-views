var STATUS_CODES = require('http').STATUS_CODES

exports.httpError = function (code, text) {
    var msg = STATUS_CODES[code]
    if (text) msg = msg + '. ' + text
    var err = new Error(msg)
    err.status = code
    return err
}

exports.nextOnENOENT = function (error, next) {
    error.code == 'ENOENT' ? next() : next(error)
}

exports.mix = function (t, var_src) {
    for (var i = 1; i < arguments.length; i++) {
        var src = arguments[i]
        for (var key in src) {
            t[key] = src[key]
        }
    }
    return t
}