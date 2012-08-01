var _ = require('underscore');
var mime = require('mime');

module.exports = function muntz(fn, request, paramVal, callback) {
  var response;
  if (typeof paramVal === 'function')
    callback = paramVal, paramVal = callback;

  if (typeof request === 'function')
    callback = request, request = {};

  request = _.defaults(request, {
    url: '',
    headers: {},
    params: {},
    session: {},
    query: {},
    flash: function (){},
    param: function (key) { return this.params[key] }
  });

  response = {
    headers: {},
    header: function (key, value) {
      if (value) return this.headers[key] = value;
      return this.headers[key];
    },
    setHeader: function (key, value) {
      return this.headers[key] = value;
    },
    contentType: function (type) {
      return this.header('Content-Type', mime.lookup(type));
    },
    send: function (data, status) {
      var meta = { type: 'send' };
      this.body = data;
      this.status = status || 200;
      callback(request, this, meta);
    },
    json: function (data, status) {
      var meta = { type: 'json' };
      this.body = data;
      this.status = status;
      callback(request, this, meta);
    },
    render: function (path, options) {
      options = options || {};
      var meta = { type: 'render', options: options, path: path };
      this.status = options.status || 200;
      callback(request, this, meta);
    },
  };
  response._request = request;

  function next () {
    response.fntype = 'next';
    callback(request, response);
  }

  return fn(request, response, next, paramVal);
};
