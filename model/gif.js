/* eslint-disable no-useless-catch */
const pool = require('../config/config');

class GifModel {
  static async gifPost(gif) {
    try {
      const newGifQuery = 'INSERT INTO gifs (title, imageurl, flaggedinvalid, public_id, claps, userid) VALUES($1,$2,$3,$4,$5,$6) RETURNING *';

      const values = [`${gif.title}`, `${gif.imageurl}`, 0, `${gif.public_id}`, 0, `${gif.userid}`];
      const result = pool.query(newGifQuery, values);
      console.log(result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  static async getGifs(gif) {
    const search = 'SELECT * FROM gifs WHERE gifid = $1';
    const searchQuery = [gif.gifid];
    const returnabled = pool.query(search, searchQuery);
    // console.log(returnabled);
    return returnabled;
  }

  static async DeleteGif(gif) {
    try {
      console.log(gif);
      const deleteQuery = 'DELETE FROM gifs WHERE gifid = $1 RETURNING *';
      const del = [gif.gifid];
      const returnabled = await pool.query(deleteQuery, del);
      console.log(returnabled.rows);
      return returnabled.rows;
    } catch (err) {
      throw err;
    }
  }
}


module.exports = GifModel;
