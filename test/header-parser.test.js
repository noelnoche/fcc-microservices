const chai = require('chai');
const { expect } = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../src/server');

describe('BDD: Header parser', () => {
  after(() => {
    server.close;
  });

  describe('GET: /header-parser/api/v1/whoami', () => {
    it('Expect: IP address, language and agent properties', (done) => {
      chai.request(server)
        .get('/header-parser/api/v1/whoami')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(res.body.ip).to.be.a('string');
          expect(res.body).to.have.property('lang');
          expect(res.body).to.have.property('agent');
          done();
        });
    });
  });
});