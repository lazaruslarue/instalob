var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Q      = require('q');

var HashtagSchema = new Schema({
  Hashtag: String, 
  Owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', 
    unique: true
  }, 
  Recipients: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Recipient'
  }]
});

HashtagSchema.set('toObject', { getters: true });

// HashtagSchema.method.findByOwnerId = function(ownerId) {
//   // return Owner's Hashtags 
// }

HashtagSchema.statics.createNew = function(obj){ //TODO: currently creates duplicate hashes
  var defer = Q.defer();
  var User = mongoose.model('User');
  var Hashtag = mongoose.model('Hashtag');
  var newhash = new Hashtag({'Hashtag': obj.tagName});
  newhash.save();
  User.findOne({'instagram.id': obj.userid})
  .populate('Hashtags', 'Hashtag')
  .exec( function(err, User){
    if (err) defer.reject(err);
    if (User) {
      User.Hashtags.addToSet(newhash);
      User.save(); // TODO: this is ugly... should be fixed, i think.
      defer.resolve(User.Hashtags);
    }
  });
  return defer.promise;
};

HashtagSchema.statics.addRecipient = function(data){
  console.log('data in hash.addRecipient method: ',data.data);

  var defer     = Q.defer(),
      Hashtag   = mongoose.model('Hashtag'),
      User      = mongoose.model('User'),
      Recipient = mongoose.model('Recipient'),
      ownerid   = data.data.ownerid,
      hashid    = data.data.hashid,
      recipient = data.data.recipientObject;
  Hashtag.findOne({'_id': hashid })
    .populate('Recipients', 'Recipient')
    .exec(function(err, hashtag){
      // console.log(' recipient object after addtoset ',hashtag.Recipients);

      if (err) defer.reject(err);
      if (hashtag) hashtag.Recipients.addToSet(recipient);
      hashtag.save();
      obj = {
        data: data.data,
        updatedArray : hashtag.Recipients
      };
      defer.resolve(obj);
      console.log(' recipient object after addtoset ',hashtag.Recipients);
  });
  return defer.promise;
};

// will return a Hashtag's recipientArray 
HashtagSchema.statics.findHashTagsRecipients = function(data){
  var defer = Q.defer();
  var Hashtag = mongoose.model('Hashtag');
      console.log('before id: ' ,data);

  var id = data.hashid;
  Hashtag.findOne({'_id': id})
    .populate('Recipients', 'Recipient')
    .exec(function(err, hash) {
      console.log('args log:' ,arguments);

      if(err) defer.reject(err);
      var obj = {
        data: data,
        hashArray: hash.Recipients
      };
      if(hash) defer.resolve(obj);
  });
  return defer.promise;
};

module.exports = mongoose.model('Hashtag', HashtagSchema);
