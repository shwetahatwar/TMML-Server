/**
 * MaintenanceTransaction.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    machineId:{
      model:'AppMachine'
    },
    maintenanceOn:{
      type:'string'
    },
    maintenanceBy:{
      model:'AppUser'
    },
    remarks:{
      type:'string'
    }
  },

};

