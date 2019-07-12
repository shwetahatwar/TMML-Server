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
      unique: true
    },
    subject:{
      type:'string',
    },
    body:{
      type:'string',
    },
  },

};
