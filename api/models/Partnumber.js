/**
 * Partnumber.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    
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
      model:'Rawmaterial'
    },
    createdBy: {
      model:'AppUser'
    },
    updatedBy: {
      model:'AppUser'
    },
  },

};

