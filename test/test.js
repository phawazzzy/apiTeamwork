/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');

chai.use(chaiHttp);
const { expect } = chai;

// const baseUrl = 'http://localhost:3000/api/v1';

describe('Hello world test', () => {
  describe('GET /', () => {
    it('returns status code 200', (done) => {
      chai.request(app)
        .get('/api/v1/')
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.include({
            message: 'hello world'
          });
        })
        .catch((err) => {
          throw err;
        });
      done();
    });
  });
});
