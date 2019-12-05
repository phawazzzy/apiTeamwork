/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');

const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBoYXdhenp6eUBnbWFpbC5jb20iLCJ1c2VySWQiOjQsImxhc3ROYW1lIjoia2FyZWVtIiwiaWF0IjoxNTc1NTQwODE3LCJleHAiOjE1NzU2MjcyMTd9.IApIiBU1_rBlJUSANKlBVzg_fW8lWdngpdN_kI2WuFU';


chai.use(chaiHttp);
const { expect } = chai;

// eslint-disable-next-line no-undef
describe('test for posting article', () => {
  it('should check if the user posting is auth before posting the article', (done) => {
    chai.request(app)
      .post('/api/v1/articles/')
      .set('Content-Type', 'application/json')
      .set({ Authorization: token })
      .field('title', 'my new article')
      .field('content', 'Lorem ipsum ffghggzgdggggdkuhkhkhjkjhkhk jhhbdbbwibdiblaibwilbliuiugfug8grfggwlygflgwggug')
      .then((res) => {
        expect(res.status).to.equal(201);
        expect(res.body.data).to.include({
          message: 'Article succesfully posted'
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
    done();
  });
});

describe('test for updating', () => {
  it('should check if the user is the original poster of the article', (done) => {
    chai.request(app)
      .patch('/api/v1/articles/20')
      .set('Content-Type', 'application/json')
      .set({ Authorization: token })
      // .field('articleid', '1')
      .field('title', 'my article edit')
      .field('content', 'lorem lorem lorem lorem updated')
      .then((res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(201);
        expect(res.body).to.include({
          status: 'success',
          message: 'Article successfully updated'
        });
        // done();
      })
      .catch((err) => {
        console.log(err);
      });
    done();
  });
});

describe('delete article', () => {
  it('should check if the user is the original poster of the article', (done) => {
    chai.request(app)
      .delete('/api/v1/articles/11')
      .set('Content-Type', 'application/json')
      .set({ Authorization: token })
      // .field('articleid', '1')
      .field('title', 'my article edit')
      .field('content', 'lorem lorem lorem lorem updated')
      .then((res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(200);
        expect(res.body.status).to.include('success');
        expect(res.body.data).to.include({
          message: 'Article successfully deleted'
        });
      })
      .catch((err) => {
        console.log(err);
      });
    done();
  });
});

describe('post comment', () => {
  it('should check if the user is the auth before posting', (done) => {
    chai.request(app)
      .post('/api/v1/articles/5/comment')
      .set('Content-Type', 'application/json')
      .set({ Authorization: token })
      .field('comment', 'this is a nw coomment on this article')
      .then((res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(201);
        // console.log(res.body);
        expect(res.body.status).to.include('success');
        expect(res.body.data).to.include({
          message: 'Comment successfully created',

        });
        // done();
      })
      .catch((err) => {
        console.log(err);
      });
    done();
  });
});
