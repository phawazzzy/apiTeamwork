/* eslint-disable no-useless-catch */
const pool = require('../config/config');

class ArticlesModel {
  static async articlePost(article) {
    try {
      const newArticleQuery = 'INSERT INTO articles (title, content) VALUES($1,$2) RETURNING *';

      const values = [`${article.title}`, `${article.content}`];
      const result = pool.query(newArticleQuery, values);
      console.log(result);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = ArticlesModel;
