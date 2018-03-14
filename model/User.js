var mongoose = require('mongoose');

var User = mongoose.model('User', {
    firstName : String,
    lastName  : String,
    email     : String,
    password  : String
});

module.exports = User;