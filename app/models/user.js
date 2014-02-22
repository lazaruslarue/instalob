var mongoose = require('mongoose');
var Schema = mongoose.Schema;

models = {};

var UserSchema = new Schema({
  id: Number,
  name: String,
  privateKey: String,
  publicKey: String
});

UserSchema.set('toObject', { getters: true });


models.User = mongoose.model('User', UserSchema);

module.exports = models;