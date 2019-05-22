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
    name:{
      type:'string',
      unique: true
    },
    description:{
      type:'string'
    },
    materialTypeId:{
      model:'MaterialType'
    },
    createdBy: {
      model:'AppUser'
    },
    updatedBy: {
      model:'AppUser'
    },
  },

};

