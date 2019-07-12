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
      unique: true
    },
    description:{
      type:'string'
    },
    rmCreateDate:{
      type:'number',
    },
    rmUpdateDate:{
      type:'number',
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
