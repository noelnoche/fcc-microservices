const chai = require('chai');
const { expect } = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../src/server');

const imageAbstract = require('../src/controllers/image-abstract');
const saveToHistory = imageAbstract._saveToHistory;

describe('BDD: Image abstract', () => {
  afterEach(() => {
    server.close;
  });

  describe('GET: /image-abstract/api/v1/entry/apple?offset=3', () => {
    it('Expect: Get array of 3 results for "apple" with properties "imageLink", "snippet", "thumbnail" and "siteLink"', (done) => {
      chai.request(server)
        .get('/image-abstract/api/v1/entry/apple?offset=3')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          expect(res.body.length).to.equal(3);
          expect(res.body[0]).to.have.property('imageLink');
          expect(res.body[0]).to.have.property('snippet');
          expect(res.body[0]).to.have.property('thumbnail');
          expect(res.body[0]).to.have.property('siteLink');
          done();
        })
    });
  });

  describe('GET: /image-abstract/api/v1/history', () => {
    before(() => {
      saveToHistory('apple');
    });

    it('Expect: First item is object wiht properties "term" equal to "apple" and "when" equal to search timestamp', (done) => {
      chai.request(server)
        .get('/image-abstract/api/v1/history')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          expect(res.body[0]).to.have.property('term');
          expect(res.body[0].term).to.equal('apple');
          expect(res.body[0]).to.have.property('when');
          expect(res.body[0].when).match(/[0-9]{4}-[0-9]{2}-/);
          done();
        })
    });
  });
});