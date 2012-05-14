var STATUS_CODES = require('http').STATUS_CODES

module.exports = function (code, text) {
    var msg = STATUS_CODES[code]
    if (text) msg = msg + '. ' + text
    var err = new Error(msg)
    err.status = code
    return err
}