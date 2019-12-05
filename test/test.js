/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');

const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBoYXdhenp6eUBnbWFpbC5jb20iLCJ1c2VySWQiOjQsImxhc3ROYW1lIjoia2FyZWVtIiwiaWF0IjoxNTc1NTQwODE3LCJleHAiOjE1NzU2MjcyMTd9.IApIiBU1_rBlJUSANKlBVzg_fW8lWdngpdN_kI2WuFU';

chai.use(chaiHttp);
const { expect } = chai;


describe('Auth endpoint', () => {
  describe('test for the create-account', () => {
    it('should create user account', (done) => {
      const user = {
        firstName: 'fawas',
        lastName: 'kareem',
        email: 'iam@gmail.com',
        password: '123456789',
        gender: 'male',
        jobRole: 'deveoper',
        department: 'tech',
        address: '5 oyinbo street, abuja',
      };
      chai.request(app)
        .post('/api/v1/auth/create-user')
        .set('Content-Type', 'application/json')
        .set({ Authorization: token })
        .send(user)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.status).to.equal(201);
          expect(res.body.data).to.include({
            firstname: 'fawas',
            lastname: 'kareem'
          });
        })
        .catch((err) => {
          throw err;
        });
      done();
    });
  });

  describe('this test for the signUp', () => {
    it('should log the user in', () => {
      // eslint-disable-next-line no-unused-vars
      const userDetails = {
        email: 'phawazzzy@gmail.com',
        password: 'Hardemola29'
      };
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'application/json')
        .send(userDetails)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.status).to.equal(201);
          expect(res.body.data).to.include({
            firstName: 'fawas',
            lastName: 'kareem',
            // message: 'login succesful'
          });
        });
    });
  });
});
