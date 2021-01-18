'use strict';
const { promisify } = require('util');

module.exports = function (app, myDBMap) {

  const User = require("./db/UserModel");

  app.route('/api/exercise/log')
    .get(async (req, res) => {
      try {
        let { userId, from, to, limit } = req.query
        if (!userId) throw new Error('Unknown userId')

        const user = await User.findById(userId).exec()
        if (from && to) {
          from = new Date((from + 'T00:00:00'))
          to = new Date((to + 'T00:00:00'))
          user.exercises = user.exercises.filter((item) => {
            if (item.date >= from && item.date <= to) {
              return item
            }
          })
        }
        if (limit) {
          let count = 1
          user.exercises = user.exercises.filter(item => {
            if (count <= limit) {
              count++
              return item
            }
          })
        }
        const result = {
          count: user.exercises.length,
          log: user.exercises
        }
        return res.json(result)
      } catch (error) {
        return res.json({ error: error.message })
      }
    });
  app.route('/api/exercise/users')
    .get(async (req, res) => {
      try {
        const users = await User.find().exec()
        res.json(users)
      } catch (error) {
        return res.json({ error: error.message })
      }
    });
  app.route('/api/exercise/new-user')
    .post(async (req, res) => {
      try {
        let { username } = req.body
        const user = new User({ username });
        if (user.validateSync()) {
          return res.send("Path `username` is required.");
        }

        let newUser = await user.save();
        return res.json(newUser.toObject())
      } catch (error) {
        return res.send('Username already taken')
      }
    });

  app.route('/api/exercise/add')
    .post(async (req, res) => {
      try {
        let { userId, description, duration, date } = req.body
        if (!userId) throw new Error('Unknown userId')
        if (!duration) throw new Error('Path `duration` is required.')
        if (!description) throw new Error('Path `description` is required.')
        if (date) {
          date += 'T00:00:00'
        }

        const user = await User.findById(userId).exec()
        const exercise = user.exercises.create({ description, duration, date });
        if (exercise.validateSync()) {
          return res.send("erros alguma");
        }
        user.exercises.push(exercise)
        await user.save()
        return res.json({
          ...exercise.toObject(),
          _id: user._id,
          username: user.username
        })
      } catch (error) {
        return res.json({ error: error.message })
      }
    });


};
