const chai = require('chai');
const { expect } = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../src/server');

describe('BDD: Timestamp Service', () => {
  after(() => {
    server.close;
  });

  describe('GET: /timestamp/api/v1/{query}', () => {
    it('Expect: Unix encoded timestamp', (done) => {
      chai.request(server)
        .get('/timestamp/api/v1/January 1, 2020')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(res.body.unix).match(/^[0-9]+$/);
          done();
        })
    });
    it('Expect: Natural (human-readable) date', (done) => {
      chai.request(server)
        .get('/timestamp/api/v1/1577836800')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(res.body.natural).match(/[A-Za-z]\w+ [0-9]{1,2}, [0-9]{4}/);
          done();
        })
    });
  });
});