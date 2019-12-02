const pool = require('../config/config');

class feedModel {
  static async feed() {
    // eslint-disable-next-line no-useless-catch
    try {
      const feed = 'select articleid as id, title, content, datecreated, userid, concat(firstname, \' \' , lastname) as poster from articles inner join users on users.id = articles.userid union select  gifid as id, title, imageurl, datecreated, userid, concat(firstname, \' \' , lastname) as poster from gifs inner join users on users.id =gifs.userid order by datecreated asc';
      const result = await pool.query(feed);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = feedModel;
