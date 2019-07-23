/**
 * MailConfig.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    mailSubject:{
      type:'string'
    },
    mailBody:{
      type:'string'
    },
    senderUsername:{
      type:'string'
    },
    maintenanceStatus:{
      type:'string'
    }
  },

};

