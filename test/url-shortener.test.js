const chai = require('chai');
const { expect } = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../src/server');

// const imageAbstract = require('../src/controllers/image-abstract');
// const saveToHistory = imageAbstract._saveToHistory;

describe('BDD: URL shortener', () => {
  after(() => {
    server.close;
  });

  describe('GET: /url-shortener/api/v1/new/*', () => {
    it('Expect: An object with properties "original_url", "short_url" and "_id"', (done) => {
      chai.request(server)
        .get('/url-shortener/api/v1/new/http://www.this-is-a-long-host-address.com/fi/fy/fo/fum')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(res.body).to.have.property('original_url');
          expect(res.body).to.have.property('short_url');
          expect(res.body).to.have.property('_id');
          done();
        })
    });

    it('Expect: Not providing a URL to cause error message', (done) => {
      chai.request(server)
        .get('/url-shortener/api/v1/new/')
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.text).to.equal('Error: No original URL provided');
          done();
        })
    });

    it('Expect: URL without protocol to cause error message', (done) => {
      chai.request(server)
        .get('/url-shortener/api/v1/new/www.this-is-a-long-host-address.com/fi/fy/fo/fum')
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.text).to.equal('Error: Need to include the URL protocol with double slashes');
          done();
        })
    });

    it('Expect: Invalid URL format to cause an error message', (done) => {
      chai.request(server)
        .get('/url-shortener/api/v1/new/http://www.this-is-a-bad-host-address./fi/fy/fo/fum')
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.text).to.equal('Error: Invalid URL host address');
          done();
        })
    });
  });
});