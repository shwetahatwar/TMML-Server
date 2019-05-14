/**
 * MachineType.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name:{
      type:'string'
    },
    createdBy: {
      model:'AppUser'
    },
    updatedBy: {
      model:'AppUser'
    },
  },

};

