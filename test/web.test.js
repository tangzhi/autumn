var app = require('../index');
var request = require('supertest')(app);
var should = require('chai').should();
var join = require('path').join;
var read = require('fs').readFileSync;


describe('/\\.html/', function test() {
  var path = join(__dirname, '../web', 'index.html');
  var content = read(path, { encoding: 'utf8' });
  var etag;
  var lastmodified;

  it('index.html should be ok', function testOK(done) {
    request
      .get('/index.html')
      .expect(200, content)
      .expect('ETag', /^W\//)
      .expect('Last-Modified', /.*/)
      .expect(function get(res) {
        should.exist(res.headers.etag);
        should.exist(res.headers['last-modified']);
        etag = res.headers.etag;
        lastmodified = res.headers['last-modified'];
      })
      .end(done);
  });

  it('request index.html with If-Modified-Since should return 304', function test304(done) {
    request
      .get('/index.html')
      .set('If-Modified-Since', lastmodified)
      .expect(304, '')
      .end(done);
  });

  it('request index.html with If-None-Match should return 304', function test304(done) {
    request
      .get('/index.html')
      .set('If-None-Match', etag)
      .expect(304, '')
      .end(done);
  });

  it('login.html should be ok', function testOK(done) {
    request
      .get('/login.html')
      .expect(200, content)
      .expect('ETag', /^W\//)
      .expect('Last-Modified', /.*/)
      .end(done);
  });

  it('other uri should be ok', function testOK(done) {
    request
      .get('/other')
      .expect(200, content)
      .expect('ETag', /^W\//)
      .expect('Last-Modified', /.*/)
      .end(done);
  });
});
