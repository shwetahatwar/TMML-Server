/**
 * Message.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    type:{
      type:'string',  // sms or email
      columnType: '_stringkey',
      unique: true,
      required: true
    },
    subject:{
      type:'string',
    },
    body:{
      type:'string',
    },
  },

};
