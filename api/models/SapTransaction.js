/**
 * SapTransaction.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    plant:{
      type:'string'
    },
    date:{
      type:'number'
    },
    material:{
      type:'string'
    },
    jobCard:{
      type:'string'
    },
    uniqueNumber:{
      type:'number'
    },
    quantity:{
      type:'number'
    },
    documentNumber:{
      type:'string'
    },
    documentYear:{
      type:'number'
    },
    remarks:{
      type:'string'
    }
  },

};

