/**
 * Machinegroup.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name:{
      type:'string',
      unique: true
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
    machines: {
      collection:'Machine',
      via: 'machineGroupId',
    }
  },

};
