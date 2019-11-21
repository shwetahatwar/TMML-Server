/**
 * TrolleyType.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name:{
      type:'string',
      columnType: '_stringkey',
      unique: true,
      required: true
    },
    createdBy:{
      model:'User'
    }
  },

};

