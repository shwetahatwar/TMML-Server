/**
 * Rawmaterial.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    rawMaterialNumber:{
      type:'number',
      // columnType: 'integer',
      // autoCreatedAt: true,
      // autoMigrations: { columnType: '_numbertimestamp' },
      unique: true,
      required: true
    },
    description:{
      type:'string'
    },
    rmCreateDate:{
      type:'number',
      // autoCreatedAt: true,
      // autoMigrations: { columnType: '_numbertimestamp' },
      // columnType: 'int8',
    },
    rmUpdateDate:{
      type:'number',
      // autoCreatedAt: true,
      // autoMigrations: { columnType: '_numbertimestamp' },
      // columnType: 'int8',
    },
    materialTypeId:{
      model:'MaterialType'
    },
    status:{
      type:'number'
    },
    createdBy: {
      model:'User'
    },
    updatedBy: {
      model:'User'
    },
  },

};
