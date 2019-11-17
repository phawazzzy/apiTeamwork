/* eslint-disable no-useless-catch */
const pool = require('../config/config');

class GifModel {
  static async gifPost(gif) {
    try {
      const newGifQuery = 'INSERT INTO gifs (title, imageurl, flaggedinvalid, public_id, claps, userid) VALUES($1,$2,$3,$4,$5,$6)';

      const values = [`${gif.title}`, `${gif.imageurl}`, 0, `${gif.public_id}`, 0, `${gif.userid}`];
      const { rows } = pool.query(newGifQuery, values);
      console.log(rows[0]);
      return rows[0];
    } catch (err) {
      throw err;
    }
  }
}


module.exports = GifModel;
