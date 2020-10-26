const chai = require('chai');
const { expect } = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../src/server');

describe('BDD: File Anayzer', () => {
  after(() => {
    server.close;
  });

  describe('POST: /file-analyzer/api/v1/findsize', () => {
    it('Expect: Successful file data POST call', (done) => {
      chai.request(server)
        .post('/file-analyzer/api/v1/findsize')
        .send('fileData')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(res.body.upload).to.equal('successful');
          done();
        });
    });
  });
});