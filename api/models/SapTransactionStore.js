/**
 * SapTransactionStore.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    documentNumber313:{
      type:'string'
    },
    documentYear313:{
      type:'number',
      columnType: 'integer',
    },
    jobCard:{
      type:'string'
    },
    uniqueNumber:{
      type:'string',
      // columnType: 'bigint',
    },
    quantity313:{
      type:'number',
      columnType: 'integer',
    },
    documentNumber315:{
      type:'string'
    },
    documentYear315:{
      type:'number',
      columnType: 'integer',
    },
    quantity315:{
      type:'number',
      columnType: 'integer',
    },
    remarks:{
      type:'string'
    }
  },

};
