/**
 * AppUser.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const bcrypt = require('bcrypt-nodejs');
module.exports = {

  attributes: {
    userName: {
      type: 'string',
      unique: true,
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    createdBy: {
      model:'AppUser'
    },
    updatedBy: {
      model:'AppUser'
    },
    department:{
      model:'AppUser'
    }
  },
  customToJSON: function() {
    return _.omit(this, ['password','createdAt','updatedAt','department'])
  },
  beforeCreate: function(appuser, cb){
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(appuser.password, salt, null, function(err, hash){
        if(err) return cb(err);
        appuser.password = hash;
        return cb();
      });
    });
  }
};

