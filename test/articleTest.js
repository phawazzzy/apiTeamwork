const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');

chai.use(chaiHttp);
const { expect } = chai;

describe('test for posting article', () => {
  it('should check if the user posting is auth before posting the article', (done) => {
    const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBoYXdhenp6eUBnbWFpbC5jb20iLCJ1c2VySWQiOjQsImxhc3ROYW1lIjoia2FyZWVtIiwiaWF0IjoxNTc0MTcwMTMyLCJleHAiOjE1NzQyNTY1MzJ9.2Z_kNa_QWgHHJppK4v8Pf9GsloSUGUm1RYnsYDgoth0';
    chai.request(app)
      .post('/api/v1/articles')
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
