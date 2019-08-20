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
      columnType: '_stringkey',
      unique: true,
      required: true
    },
    operationType:{
      type:'string'
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
      type:'number',
      columnType: 'integer',
    },
    cellId:{
      model:'Cell'
    },
    machineWeight:{
      type:'number',
      columnType: 'integer',
    },
    status:{
      type:'number',
      columnType: 'integer',
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
      type:'number',
      columnType: 'integer',
    },
    nextMaintenanceOn:{
      type:'number',
      columnType: 'bigint',
    },
    lastMaintenanceOn:{
      type:'number',
      columnType: 'bigint',
    },
    lastMaintenanceBy:{
      model:'Employee'
    },
    isAutomacticCount:{
      type:'number',
      columnType: 'integer',
    },
    maintenanceDetails: {
      collection: 'MaintenanceTransaction',
      via: 'machineId',
    }
  },

};
