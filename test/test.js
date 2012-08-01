var test = require('tap').test;
var muntz = require('..');

test('#send', function (t) {
  function hdlr (req, resp, next) { resp.send('okay', 200) }
  muntz(hdlr, function (req, resp, meta) {
    t.same(meta.type, 'send', 'should be a `send`');
    t.same(resp.status, 200, 'should be status 200');
    t.same(resp.body, 'okay', 'body should be `okay`');
    t.end();
  });
});

test('#json', function (t) {
  function hdlr (req, resp, next) { resp.json({ message: 'yup' }, 200) }
  muntz(hdlr, function (req, resp, meta) {
    t.same(meta.type, 'json', 'should be a `json` call');
    t.same(resp.status, '200', 'should be status 200');
    t.same(resp.body.message, 'yup', 'should have json body');
    t.end();
  });
});

test('#render', function (t) {
  var opts = { some: "thing", status: 404 };
  function hdlr (req, resp, next) {
    resp.statusCode = 'fffffffuuuuuuuuuuuu';
    resp.render('ohai', opts);
  }
  muntz(hdlr, function (req, resp, meta) {
    t.same(meta.type, 'render', 'should be a `render` call');
    t.same(meta.path, 'ohai', 'should have correct path');
    t.same(meta.options, opts, 'should have correct opts');
    t.same(resp.status, 404, 'should be status 404');
    t.end();
  });
});

test('#header', function (t) {
  function hdlr (req, resp, next) {
    resp.header('oh', 'hai');
    resp.send('okay')
  };
  muntz(hdlr, { headers: { hdlr: 'lol' }}, function (req, resp, meta) {
    t.same(req.headers['hdlr'], 'lol', 'should have correct request header')
    t.same(resp.headers['oh'], 'hai', 'should have correct response header');
    t.end();
  });
});

test('#next', function (t) {
  function mware(req, resp, next) {
    resp.header('oh', 'hai');
    next();
  }
  muntz(mware, function (req, resp, meta) {
    t.same(resp.headers['oh'], 'hai');
    t.end();
  });
});

test('#contentType', function (t) {
  t.test('json', function (t) {
    function hdlr (req, resp, next) {
      resp.contentType('json');
      resp.send('okay');
    }
    muntz(hdlr, function (req, resp, meta) {
      t.same(resp.headers['Content-Type'], 'application/json');
      t.end();
    });
  });

  t.test('txt', function (t) {
    function hdlr (req, resp, next) {
      resp.contentType('txt');
      resp.send('okay');
    }
    muntz(hdlr, {}, function (req, resp, meta) {
      t.same(resp.headers['Content-Type'], 'text/plain');
      t.end();
    });
  });

  t.test('html', function (t) {
    function hdlr (req, resp, next) {
      resp.contentType('html');
      resp.send('okay');
    }
    muntz(hdlr, function (req, resp, meta) {
      t.same(resp.headers['Content-Type'], 'text/html');
      t.end();
    });
  });
});

