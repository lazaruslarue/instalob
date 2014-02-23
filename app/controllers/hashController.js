var User        = require('../models/user.js'),
    Recipient   = require('../models/recipient.js'),
    Hash        = require('../models/hashtag.js'),
    request     = require('request'),
    path        = require('path'),
    Q      = require('q');



module.exports = {
  delete: function(req, res){
    Hash.findOneAndRemove({'_id': req._id}, function(err, hashtag){
      if(err) throw new Error(err);
      res.send(204);
    });
  },
  newTag: function(req, res){
    if (process.env.NODE_ENV === 'local') req.user = {_id:'5308efe226bfdc6d1afbc770'}; // for testing
    // make hashtag for owner
    var obj = {
      userid   : req.user._id,
      tagName  : req.params.tagName
    };
    User.findOne({_id: obj.userid})
    .exec(function(err, owner){
      obj.owner = owner;
      Hash.createNew(obj)
      .then(function (result){
        res.send(result);
      });
    });
  },
  recipientResponse: function(req, res) {
    
    res.send('thanks for subscribing, keep an eye on your PO Box');
  },
  addRecipientToHashtag: function(req, res) {
    if (process.env.NODE_ENV === 'local') req.user = {_id:'5308efe226bfdc6d1afbc770'}; // for testing
    console.log(req.body);
    var recipient = new Recipient(req.body);
    recipient.beOwnedByUserId(req._id)
    recipient.save();
    var obj = {
      ownerid         : req._id ,
      hashid          : req.body.hashid,
      recipientObject : recipient,
    };
    addNewRecipient(obj); // todo: down below
    res.send('finish add');
  },
  // removes: {recipient: {}, remove: true}
  returnRecipients: function(req, res){
    // look up user's hashtags, 
    var user = req.user._id;
    // CAN USE: Hash.findHashTagsRecipients to get hashes
    // return all recipients in an array
    // 
    var hashtag = req.body;

  }
};

// from hashtag
// create new recipient, with owner & new e-mail
// generate URL that points to the form for the recipient
// spam recipinent with a link to that URL
// user visits URL, submits form,
// form verifies address (lobController.js)
// if legit, updates Hash.Recipients array 

var addNewRecipient = function(obj){
  // add recipient to hashtag from the form
  console.log('addnewrecipient obj', obj);

  Hash.findHashTagsRecipients(obj)
  .then(Hash.addRecipient)
  // .then()
  // .findHashTagsRecipients()
  .then(function() {
    console.log('arguments resolved from hash.addRecipient in addNewRecipient',arguments);
    result.hashArray.addToSet(obj.recipientObject);
    result.hashArray.save();
    console.log(result.hashArray);
  })
  .fail(function(err) {
    console.log("big fail little man:", arguments);
  });
  // 
  // .populate('Recipients', 'Recipient')
  // .exec(function(err, hash){
  //   if(err) throw new Error(err);  
  //   hash.Recipients.addToSet(obj)
  //   .then(function (result) {
  //     res.send(result);
  //   });
  // });
};