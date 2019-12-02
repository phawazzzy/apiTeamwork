/* eslint-disable consistent-return */
const feedModel = require('../model/feeds');

exports.feed = async (req, res) => {
  try {
    const getall = await feedModel.feed();
    if (getall && getall.rowCount > 1) {
      console.log(getall.rows);
      return res.status(200).json({
        status: 'success',
        data: getall.rows.map((docs) => {
          return {
            id: docs.id,
            createdOn: docs.datecreated,
            title: docs.title,
            authorId: docs.userid,
            content: docs.content
          };
        })
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: `error ${error} occured`
    });
  }
};
