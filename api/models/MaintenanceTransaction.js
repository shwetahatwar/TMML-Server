/**
 * MaintenanceTransaction.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    machineId:{
      model:'Machine'
    },
    maintenanceOn:{
      type:'number'
    },
    maintenanceBy:{
      model:'Employee'
    },
    remarks:{
      type:'string'
    },
    partReplaced:{
      type:'string'
    },
    costOfPartReplaced: {
      type: 'string'
    },
    machineStatus:{
      type:'string'
    }
  },

};
