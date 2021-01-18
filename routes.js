'use strict';
const { promisify } = require('util');

module.exports = function (app, myDBMap) {


  app.route('/api/exercise/log')
    .get((req, res) => {
      try {
        const { userId, from, to, limit } = req.params
        if (!userId) throw new Error('req')
      } catch (error) {
        return res.json({ error: error.message })
      }
    });
  app.route('/api/exercise/new-user')
    .post(async (req, res) => {
      try {
        let { username } = req.body
      } catch (error) {
        return res.json({ error: error.message })
      }
    });

  app.route('/api/exercise/add')
    .post(async (req, res) => {
      try {
        let { userId, description, duration, date } = req.body
      } catch (error) {
        return res.json({ error: error.message })
      }
    });


};
