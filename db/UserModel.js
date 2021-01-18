
const mongoose = require("mongoose")

const {
  Schema
} = mongoose;

var schemaOptions = {
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) { delete ret.id }
  }
};

const exerciseSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
      transform: function (date) {
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        }).replace(/,/g, '')
      }
    }
  })


const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  exercises: [exerciseSchema]


}, {
  versionKey: false,
  collection: "users",
  ...schemaOptions,
});

UserSchema.virtual('count').get(function () {
  return this.exercises.length;
});

module.exports = mongoose.model('User', UserSchema)