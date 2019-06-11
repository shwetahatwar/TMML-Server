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
      type:'number'
    },
    SMH:{
      type:'number'   // this will be calculated based on cycle time (represented in hours)
    },
    rawMaterialId:{
      model:'RawMaterial'
    },
    createdBy: {
      model:'User'
    },
    updatedBy: {
      model:'User'
    },
  },

};
