var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:3030/account");

describe("Account APIs",function(){

  it("should return account_hash by public_key",function(done){
    server
    .get('/get-account/016adc82d5f8368829c9cd6088fdd39b46960dbf5a7f4fc18f498f5bc8637ec656')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200);
      should.equal(res.body.error, undefined);
      res.body.account_hash.should.equal("0cccc044cde69f1be0641bb5a74201c0f920834dbd515a666eb152e1d77125e1");
      done();
    });
  });


  it("should return transfer history of account",function(done){
    server
    .get('/get-transfers?account=b383c7cc23d18bc1b42406a1b2d29fc8dba86425197b6f553d7fd61375b5e446&start=0&count=5')
    .set('Accept', 'application/json')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200, err);
      should.equal(res.body.error, undefined);
      should.notEqual(res.body, undefined);
      should.notEqual(res.body, null);
      done();
    });
  });


  it("should return deploy history of account",function(done){
    server
    .get('/get-deploys?account=b383c7cc23d18bc1b42406a1b2d29fc8dba86425197b6f553d7fd61375b5e446&start=0&count=5')
    .set('Accept', 'application/json')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200, err);
      should.equal(res.body.error, undefined);
      should.notEqual(res.body, undefined);
      should.notEqual(res.body, null);
      done();
    });
  });

  

  it("should return list of richest account",function(done){
    server
    .get('/get-rich-accounts/?start=0&count=10')
    .set('Accept', 'application/json')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200, err);
      should.equal(res.body.error, undefined);
      should.notEqual(res.body, undefined);
      should.notEqual(res.body, null);
      done();
    });
  });

  it("should return number of holder",function(done){
    server
    .get('/count-holders')
    .set('Accept', 'application/json')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200, err);
      should.equal(res.body.error, undefined);
      should.notEqual(res.body, undefined);
      should.notEqual(res.body, null);
      done();
    });
  });


  it("should return daily rewards of account",function(done){
    server
    .get('/get-rewards?account=017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e&start=0&count=5')
    .set('Accept', 'application/json')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200, err);
      should.equal(res.body.error, undefined);
      should.notEqual(res.body, undefined);
      should.notEqual(res.body, null);
      done();
    });
  });

  it("should return era rewards of account",function(done){
    server
    .get('/get-era-reward?account=0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c&count=10')
    .set('Accept', 'application/json')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200, err);
      should.equal(res.body.error, undefined);
      should.notEqual(res.body, undefined);
      should.notEqual(res.body, null);
      done();
    });
  });


  it("should return staking history of account",function(done){
    server
    .get('/staking?account=019d4b3cfc743ece28be983f45a783ffea6d1ee6fffa49e6239e6bf6b5308f6b4d')
    .set('Accept', 'application/json')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200, err);
      should.equal(res.body.error, undefined);
      should.notEqual(res.body, undefined);
      should.notEqual(res.body, null);
      done();
    });
  });


  it("should return delegate history of account",function(done){
    server
    .get('/delegate?account=019d4b3cfc743ece28be983f45a783ffea6d1ee6fffa49e6239e6bf6b5308f6b4d')
    .set('Accept', 'application/json')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200, err);
      should.equal(res.body.error, undefined);
      should.notEqual(res.body, undefined);
      should.notEqual(res.body, null);
      done();
    });
  });

  it("should return undelegate history of account",function(done){
    server
    .get('/undelegate?account=019d4b3cfc743ece28be983f45a783ffea6d1ee6fffa49e6239e6bf6b5308f6b4d')
    .set('Accept', 'application/json')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200, err);
      should.equal(res.body.error, undefined);
      should.notEqual(res.body, undefined);
      should.notEqual(res.body, null);
      done();
    });
  });

});