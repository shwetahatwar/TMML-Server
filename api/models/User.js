/**
 * AppUser.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const bcrypt = require('bcrypt-nodejs');
module.exports = {

  attributes: {
    username: {
      type: 'string',
      unique: true,
      required: true
    },
    password: {
      type: 'string',
      required: true,
      required: true
    },
    employeeId:{
      model:'Employee'
    },
    createdBy: {
      model:'User'
    },
    updatedBy: {
      model:'User'
    },
    // department:{
    //   model:'User'
    // },
    role:{
      model:'Role'
    }
  },
  customToJSON: function() {
    return _.omit(this, ['password','createdAt','updatedAt','department'])
  },
  beforeCreate: function(user, cb){
    console.log("Before");
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(user.password, salt, null, function(err, hash){
        if(err) return cb(err);
        user.password = hash;
        return cb();
      });
    });
  }
};
