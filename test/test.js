/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../routes/user');

chai.use(chaiHttp);
const { expect } = chai;

// const baseUrl = 'http://localhost:3000/api/v1';

// describe('Hello world test', () => {
//   describe('GET /', () => {
//     it('returns status code 200', (done) => {
//       chai.request(app)
//         .get('/api/v1/')
//         .set('Accept', 'application/json')
//         .then((res) => {
//           expect(res.status).to.equal(200);
//           expect(res.body.data).to.include({
//             message: 'hello world'
//           });
//         })
//         .catch((err) => {
//           throw err;
//         });
//       done();
//     });
//   });
// });

describe('Auth endpoint', () => {
  describe('test for the create-account', () => {
    it('should create user account', (done) => {
      const user = {
        firstName: 'fawas',
        lastName: 'kareem',
        email: 'test@gmail.com',
        password: '123456789',
        gender: 'male',
        jobRole: 'deveoper',
        department: 'tech',
        address: '5 oyinbo street, abuja'
      };
      chai.request(app)
        .post('/api/v1/auth/create-user')
        .set('Accept', 'application/json')
        .send(user)
        .then((res) => {
          expect(res.status).to.equal(201);
          expect(res.body.data).to.include({
            message: 'User account is succesfully created'
          });
        })
        .catch((err) => {
          throw err;
        });
      done();
    });
  });
});
