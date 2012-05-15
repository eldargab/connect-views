module.exports = function () {
    var Markdown = require('markdown').markdown

    return {
        contentType: 'text/html',

        render: function (string, cb) {
            var dialect = this.dialect
            if (typeof dialect == 'string')
                dialect = Markdown.dialects[dialect]
            var out = Markdown.toHTML(string, dialect)
            cb(null, out)
        }
    }
}