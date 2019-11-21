/**
 * Rawmaterial.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    rawMaterialNumber:{
      type:'string',
      columnType: '_stringkey',
      unique: true,
      required: true
    },
    description:{
      type:'string'
    },
     uom:{
      type:'string'
    },
     remarks:{
      type:'string'
    },
    rmCreateDate:{
      type:'number',
      columnType: 'bigint',
    },
    rmUpdateDate:{
      type:'number',
      columnType: 'bigint',
    },
    materialTypeId:{
      model:'MaterialType'
    },
    status:{
      type:'number',
      columnType: 'integer',
    },
    createdBy: {
      model:'User'
    },
    updatedBy: {
      model:'User'
    },
  },

};
