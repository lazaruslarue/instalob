var hashController = require('../controllers/hashController.js');
var recipientController = require('../controllers/recipientController.js');

// only route in here prob is going to be this index becasuse of angular
module.exports = function(app, passport){
  app.post('/hash/new/:tagName', hashController.newTag); // make hashtag for owner
  app.post('/hash/update', hashController.addRecipient); // allow user to add/remove recipient to hashtag 
  app.get('/hash/list', hashController.returnRecipients); // get all recipients
  
  // app.post('/hash/add', recipientController.addRecipientData); // add recipient to hashtag with form data
};