/**
 * PartFile.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    partId:{
      model:'PartNumber'
    },
    fileData:{
      type:'ref',
      columnType: 'bytea' // <-- for PostgreSQL. Use `mediumblob` for MySQL.
    },
    fileType:{
      type:'string'
    }
  },

};

