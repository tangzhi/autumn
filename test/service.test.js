
var app = require('../index');
var request = require('supertest')(app);
var agent = require('supertest').agent(app);
var should = require('should');
var join = require('path').join;
var read = require('fs').readFileSync;
var root = '/service';

describe('/service/auth', function testAuth() {
  var path = join(__dirname, '../web', 'service', 'auth');
  var content = read(path, { encoding: 'utf8' });

  it('uri should be ok', function test(done) {
    request
      .post('/service/auth')
      .send({})
      .end(function end(err, res) {
        should.not.exist(err);
        res.status.should.be.Number().and.equal(200);
        done();
      });
  });

  describe('1. [post method] when user logins', function testUserLogin() {
    describe('with wrong credentials', function testWrongCreds() {
      describe('(empty payload)', function testEmptyPayload() {
        it('should return auth false', function whenEmptyPayload(done) {
          request
            .post(root + '/auth')
            .send({})
            .expect(200, { auth: false, login_err_count: 1 }, done);
        });
      });

      describe('(username is missing)', function testUsernameMissing() {
        it('should return auth false', function whenEmptyPayload(done) {
          request
            .post(root + '/auth')
            .send({ password: '123456' })
            .expect(200, { auth: false, login_err_count: 1 }, done);
        });
      });

      describe('(password is missing)', function testUsernameMissing() {
        it('should return auth false', function whenEmptyPayload(done) {
          request
            .post(root + '/auth')
            .send({ name: 'admin' })
            .expect(200, { auth: false, login_err_count: 1 }, done);
        });
      });

      describe('(login_err_count increase)', function testUsernameMissing() {
        it('should return auth false, and login_err_count increase',
        function whenEmptyPayload(done) {
          request
            .post(root + '/auth')
            .send({ name: 'admin', password: 'error', login_err_count: 1 })
            .expect(200, { auth: false, login_err_count: 2 }, done);
        });
      });
    });

    describe('with right credentials', function testRightCreds() {
      it('should immediatelly authenticate user and return right-menu',
      function whenRightCreds(done) {
        request
          .post(root + '/auth')
          .send({ name: 'admin', password: '123456' })
          .expect(200, content, done);
      });

      it('should save cookie', function whenSaveCookie(done) {
        agent
          .post(root + '/auth')
          .send({ name: 'admin', password: '123456' })
          .expect(200, content)
          .end(function end(err, res) {
            should.not.exist(err);
            should.exist(res.headers['set-cookie']);
            res.headers['set-cookie'][0].should.startWith('leaf.sid=');
            done();
          });
      });
    });
  });
  // end post method, when user logins

  describe('2. [get method] when fetch user auth at re-login', function testFetchAuth() {
    describe('without cookie', function testNoCookie() {
      it('should fetch failed without querystring', function whenNoCookie(done) {
        request
          .get(root + '/auth')
          .expect(200, { auth: false }, done);
      });

      it('should fetch failed with querystring', function whenNoCookie(done) {
        request
          .get(root + '/auth')
          .query({ name: 'admin', password: '123456' })
          .expect(200, { auth: false }, done);
      });
    });

    describe('with cookie', function testNoCookie() {
      it('should fetch failed wich wrong credentials in cooke', function whenNoCookie(done) {
        request
          .get(root + '/auth')
          .set('Cookie', 'leaf.sid=wrong')
          .expect(200, { auth: false }, done);
      });

      it('should fetch auth ok with right credentials in cookie', function whenNoCookie(done) {
        agent
          .get(root + '/auth')
          .expect(200, content, done);
      });
    });
  });
  //
});
