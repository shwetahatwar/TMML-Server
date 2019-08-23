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
      type:'string'
    },
    material:{
      type:'string'
    },
    jobCard:{
      type:'string'
    },
    uniqueNumber:{
      type:'string',
      // columnType: 'bigint',
    },
    quantity:{
      type:'number',
      columnType: 'integer',
    },
    documentNumber:{
      type:'string'
    },
    documentYear:{
      type:'number',
      columnType: 'integer',
    },
    remarks:{
      type:'string'
    }
  },

};
