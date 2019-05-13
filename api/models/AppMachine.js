/**
 * AppMachine.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    machineTypeId:{
      model:'MachineType'
    },
    machineGroupId:{
      model:'Machinegroup'
    },
    costCenterId:{
      model:'Costcenter'
    },
    capacity:{
      type:'number'
    },
    cellId:{
      model:'Cell'
    },
    machineWeight:{
      type:'number'
    },
    status:{
      type:'string'
    },
    createdBy: {
      model:'AppUser'
    },
    updatedBy: {
      model:'AppUser'
    },
    frequenceyInDays:{
      type:'number'
    },
    lastMaintenanceOn:{
      type:'string'
    },
    lastMaintenanceBy:{
      model:'AppUser'
    }
  },

};

