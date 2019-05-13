/**
 * AppUser.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    userName: {
      type: 'string'
    },
    password: {
      type: 'string'
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

};

