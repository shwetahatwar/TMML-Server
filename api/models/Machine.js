/**
 * AppMachine.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    machineName:{
      type:'string',
      unique: true,
      required: true
    },
    machineTypeId:{
      model:'MachineType'
    },
    machineGroupId:{
      // model:'MachineGroup'
      collection:'MachineGroup',
      via: 'machines',
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
      type:'number'
    },
    maintenanceStatus: {
      type: 'string'
    },
    barcodeSerial:{
      type:'string'
    },
    createdBy: {
      model:'User'
    },
    updatedBy: {
      model:'User'
    },
    frequencyInDays:{
      type:'number'
    },
    nextMaintenanceOn:{
      type:'number'
    },
    lastMaintenanceOn:{
      type:'number'
    },
    lastMaintenanceBy:{
      model:'Employee'
    },
    isAutomacticCount:{
      type:'number'
    },
    maintenanceDetails: {
      collection: 'MaintenanceTransaction',
      via: 'machineId',
    }
  },

};
