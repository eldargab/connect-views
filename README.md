# Connect views

This is a connect middleware. It serves templates like a static files, supports
request paths with omited extensions (`some/doc` vs `some/doc.md`), has built in
support for jade, markdown, less and stylus.

## Examples

Serve all templates from `./public`

``` javascript
var connect = require('connect')
var Views = require('connect-views')
var app = connect()

app.use(Views({
    root: 'public'
}))
```

Pass view engine specific options

``` javascript
app.use(Views({
    root: 'public',
    stylus: {
        paths: ['styles']
    },
    markdown: {
        dialect: 'maruku'
    }
}))
```

Integrate new view engine

``` javascript
Views.engines.haml = function () {
    var haml = require('hamljs')

    return {
        contentType: 'text/html',

        render: function (str, cb) {
            try {
                var out = haml.render(str, this)
            }
            catch (e) {
                return cb(e)
            }
            cb(null, out)
        }
    }
}

Views.engines.extensions['.haml'] = Views.engines.haml
```

Serve certain file type in a specific way

``` javascript
app.use(Views({
    '.hamlxml': (function () {
        var engine = Views.engines.haml()
        engine.contentType = 'application/xml'
        engine.xml = true
        return engine
    })()
}))
```

## License

(The MIT License)

Copyright (c) 2012 Eldar Gabdullin <eldargab@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.