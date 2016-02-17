var app = require('../index');
var request = require('supertest')(app);
var join = require('path').join;
var read = require('fs').readFileSync;


describe('/\\.html/', function test() {
  var path = join(__dirname, '../web', 'index.html');
  var content = read(path, { encoding: 'utf8' });

  it('index.html should be ok', function testOK(done) {
    request
      .get('/index.html')
      .expect(200, content)
      .expect('ETag', /^W\//)
      .expect('Last-Modified', /.*/)
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
