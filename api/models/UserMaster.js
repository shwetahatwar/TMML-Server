/**
 * UserMaster.js
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
      model:'UserMaster'
    },
    updatedBy: {
      model:'UserMaster'
    },
    department:{
      model:'UserMaster'
    }
  },
  customToJSON: function() {
      return _.omit(this, ['password','createdAt','updatedAt','department'])
    },

};

