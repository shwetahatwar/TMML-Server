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
      model:'MachineGroup'
    },
    costCenterId:{
      model:'CostCenter'
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
    barcodeSerial:{
      type:'string'
    },
    createdBy: {
      model:'AppUser'
    },
    updatedBy: {
      model:'AppUser'
    },
    frequencyInDays:{
      type:'number'
    },
    lastMaintenanceOn:{
      type:'number'
    },
    lastMaintenanceBy:{
      model:'AppUser'
    }
  },

};

