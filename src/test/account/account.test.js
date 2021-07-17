var supertest = require("supertest");
var should = require("should");

var account_server = supertest.agent("http://localhost:3030/account");

describe("Account APIs",function(){

  it("should return account_hash by public_key",function(done){
    account_server
    .get('/get-account/01bb9d7599bb8a0464946f8b7d812db16c80fb66ae345a7649d8cba96215b4a591')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200);
      should.equal(res.body.error, undefined);
      res.body.account_hash.should.equal("0e1a746f28023a25c57dfcbb12790cfa5ea78c00540ee4d8801eb39fea6989f0");
      done();
    });
  });

});