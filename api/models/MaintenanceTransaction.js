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
      model:'User'
    },
    remarks:{
      type:'string'
    },
    partReplaced:{
      type:'string'
    },
    machineStatus:{
      type:'string'
    }
  },

};

