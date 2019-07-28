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
      type:'number',
      columnType: 'bigint',
    },
    material:{
      type:'string'
    },
    jobCard:{
      type:'string'
    },
    uniqueNumber:{
      type:'number',
      columnType: 'bigint',
    },
    quantity:{
      type:'number',
      columnType: 'bigint',
    },
    documentNumber:{
      type:'string'
    },
    documentYear:{
      type:'number',
      columnType: 'bigint',
    },
    remarks:{
      type:'string'
    }
  },

};

