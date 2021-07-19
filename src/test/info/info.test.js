var supertest = require("supertest");
var should = require("should");
const { ELEMENT_TYPE } = require('../../utils/constant');
const { GetHeight, GetNetWorkRPC } = require("../../utils/common");
var server = supertest.agent("http://localhost:3030/info");

describe("Info APIs", function () {

    it("should return data of deploy by deploy hash", function (done) {
        server
            .get('/get-deploy/c0adb49f692cfca690832c163f41eaa632b1b0554383a63ca57076d92dc2e9ab')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                should.equal(res.body.error, undefined);
                should.notEqual(res.body, undefined);
                should.notEqual(res.body, null);
                res.body.deploy.hash.should.equal('c0adb49f692cfca690832c163f41eaa632b1b0554383a63ca57076d92dc2e9ab');
                done();
            });
    });


    it("should return list of deploy hashes by given block", function (done) {
        server
            .get('/get-list-deploys?id=13&b=119992')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                should.equal(res.body.error, undefined);
                should.notEqual(res.body, undefined);
                should.notEqual(res.body, null);
                res.body.deploy_hashes.length.should.equal(2);
                done();
            });
    });


    it("should return type of block height", function (done) {
        server
            .get('/get-type/10000')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                should.equal(res.body.error, undefined);
                should.notEqual(res.body, undefined);
                should.notEqual(res.body, null);
                res.body.type.should.equal(ELEMENT_TYPE.BLOCK_HEIGHT);
                done();
            });
    });

    it("should return type of unknown when block height exceed current height", function (done) {
        GetNetWorkRPC().then(url => {
            GetHeight(url).then(height => {
                server
                    .get(`/get-type/${height + 100}`)
                    .expect("Content-type", /json/)
                    .expect(200)
                    .end(function (err, res) {
                        res.status.should.equal(200);
                        should.equal(res.body.error, undefined);
                        should.notEqual(res.body, undefined);
                        should.notEqual(res.body, null);
                        res.body.type.should.equal(ELEMENT_TYPE.UNKNOWN);
                        done();
                    });
            })
        })
    });


    it("should return type of block hash", function (done) {
        server
            .get('/get-type/2a35024a904704be0cadc0097237b8505c5e3263c0865d2759f4daecd3a50a89')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                should.equal(res.body.error, undefined);
                should.notEqual(res.body, undefined);
                should.notEqual(res.body, null);
                res.body.type.should.equal(ELEMENT_TYPE.BLOCK_HASH);
                done();
            });
    });


    it("should return type of deploy hex", function (done) {
        server
            .get('/get-type/af02aa84dba22fe2e84711cbf6645240ee6effb0e4817191ef46639b8233bace')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                should.equal(res.body.error, undefined);
                should.notEqual(res.body, undefined);
                should.notEqual(res.body, null);
                res.body.type.should.equal(ELEMENT_TYPE.DEPLOY_HEX);
                done();
            });
    });


    it("should return type of public key hash", function (done) {
        server
            .get('/get-type/b3029a1cac9043e6bfd002231044c589dc0fc11b1f193780ba3a10718b5ec21c')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                should.equal(res.body.error, undefined);
                should.notEqual(res.body, undefined);
                should.notEqual(res.body, null);
                res.body.type.should.equal(ELEMENT_TYPE.PUBLIC_KEY_HASH);
                done();
            });
    });

    it("should return type of public key hex", function (done) {
        server
            .get('/get-type/013fc257eb0c34532ad7938ed3485384b0a1da52d8864e7f82a1fec9c721fd46da')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                should.equal(res.body.error, undefined);
                should.notEqual(res.body, undefined);
                should.notEqual(res.body, null);
                res.body.type.should.equal(ELEMENT_TYPE.PUBLIC_KEY_HEX);
                done();
            });
    });


    it("should return type of validator", function (done) {
        server
            .get('/get-type/017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                should.equal(res.body.error, undefined);
                should.notEqual(res.body, undefined);
                should.notEqual(res.body, null);
                res.body.type.should.equal(ELEMENT_TYPE.VALIDATOR);
                done();
            });
    });


    it("should return volume data", function (done) {
        server
            .get('/get-volume/10')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                should.equal(res.body.error, undefined);
                should.notEqual(res.body, undefined);
                should.notEqual(res.body, null);
                res.body.length.should.equal(10);
                done();
            });
    });

    it("should return transfer volume data", function (done) {
        server
            .get('/get-transfer-volume/10')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                should.equal(res.body.error, undefined);
                should.notEqual(res.body, undefined);
                should.notEqual(res.body, null);
                res.body.length.should.equal(10);
                done();
            });
    });

    it("should return stats data", function (done) {
        server
            .get('/get-stats')
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


    it("should return economics data", function (done) {
        server
            .get('/economics')
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
})