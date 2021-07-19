var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:3030/chain");

describe("Chain APIs",function(){

  it("should return data of block by block height",function(done){
    server
    .get('/get-block/13')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200);
      should.equal(res.body.error, undefined);
      should.notEqual(res.body, undefined);
      should.notEqual(res.body, null);

      res.body.result.block.header.height.should.equal(13);

      done();
    });
  });

  it("should return data of block by block hash",function(done){
    server
    .get('/get-block/173042b8f2e09fe963b1dcd6dc2ee0564dd5ec21814aac0e7f30beeb5d1fdbf6')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200);
      should.equal(res.body.error, undefined);
      should.notEqual(res.body, undefined);
      should.notEqual(res.body, null);

      res.body.result.block.header.height.should.equal(13);

      done();
    });
  });

  it("should return transfer data by block height",function(done){
    server
    .get('/get-block-transfers/34884a7ff358c7c428293a9cfca18e8a12d4d03236ff286cdc0f7b0065014214')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200);
      should.equal(res.body.error, undefined);
      should.notEqual(res.body, undefined);
      should.notEqual(res.body, null);

      res.body.length.should.equal(1);

      done();
    });
  });


  it("should return latest blocks",function(done){
    server
    .get('/get-latest-blocks/3')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200);
      should.equal(res.body.error, undefined);
      should.notEqual(res.body, undefined);
      should.notEqual(res.body, null);

      res.body.length.should.equal(3);

      done();
    });
  });


  it("should return deploy data by block hash",function(done){
    server
    .get('/get-block-deploy/34884a7ff358c7c428293a9cfca18e8a12d4d03236ff286cdc0f7b0065014214')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200);
      should.equal(res.body.error, undefined);
      should.notEqual(res.body, undefined);
      should.notEqual(res.body, null);
      res.body.length.should.equal(1);
      done();
    });
  });


  it("should return blocks by range",function(done){
    server
    .get('/get-range-block?start=1000&end=1005')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200);
      should.equal(res.body.error, undefined);
      should.notEqual(res.body, undefined);
      should.notEqual(res.body, null);
      res.body.result.length.should.equal(6);
      done();
    });
  });

  it("should return number of latest transaction",function(done){
    server
    .get('/get-latest-txs?start=0&count=3')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200);
      should.equal(res.body.error, undefined);
      should.notEqual(res.body, undefined);
      should.notEqual(res.body, null);
      res.body.length.should.equal(3);
      done();
    });
  });

  it("should return block proposer blocks by validator",function(done){
    server
    .get('/get-proposer-blocks?validator=017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e&count=10&start=0')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200);
      should.equal(res.body.error, undefined);
      should.notEqual(res.body, undefined);
      should.notEqual(res.body, null);
      res.body.length.should.equal(10);
      done();
    });
  });


})
