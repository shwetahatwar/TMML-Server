/**
 * Partnumber.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    partNumber:{
      type:'number',
      unique: true
    },
    description:{
      type:'string'
    },
    manPower:{
      type:'string'
    },
    SMH:{
      type:'string'
    },
    rawMaterialId:{
      model:'RawMaterial'
    },
    createdBy: {
      model:'AppUser'
    },
    updatedBy: {
      model:'AppUser'
    },
  },

};

