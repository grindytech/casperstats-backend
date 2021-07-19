var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3030/state");

describe("State APIs", function () {

    it("should return auction information", function (done) {
        server
            .get('/get-auction-info')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                should.equal(res.body.error, undefined);
                should.notEqual(res.body, undefined);
                should.notEqual(res.body, null);
                done();
            });
    });


    it("should return number of top validators", function (done) {
        server
            .get('/get-validators/10')
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                should.equal(res.body.error, undefined);
                should.notEqual(res.body.era_validators, undefined);
                should.notEqual(res.body.era_validators, null);
                res.body.era_validators.validators.length.should.equal(10, null, res);
                done();
            });
    });

    it("should return validator data", function (done) {
        server
            .get('/get-validator/017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e')
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                should.equal(res.body.error, undefined);
                should.notEqual(res.body, undefined);
                should.notEqual(res.body, null);
                res.body.public_key.should.equal("017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e");
                done();
            });
    });



    it("should return era validators data", function (done) {
        server
            .get('/get-era-validators')
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                should.equal(res.body.error, undefined);
                should.notEqual(res.body.auction_state, undefined);
                should.notEqual(res.body.auction_state, null);
                done();
            });
    });

    it("should return bids data", function (done) {
        server
            .get('/get-bids')
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                should.equal(res.body.error, undefined);
                should.notEqual(res.body.auction_state, undefined);
                should.notEqual(res.body.auction_state, null);
                done();
            });
    });
})