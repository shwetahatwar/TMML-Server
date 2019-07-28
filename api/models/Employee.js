/**
 * Employee.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    employeeId: {
      type: 'string',
      columnType: '_stringkey',
      unique: true,
      required: true
    },
    name: {
      type: 'string'
    },
    email:{
      type:'string'
    },
    mobileNumber:{
      type:'number',
      columnType: 'bigint',
    },
    barcodeSerial:{
      type:'string'
    },
    status:{
      type:'number',
      columnType: 'bigint',
    },
    notifyForMachineMaintenance:{
      type:'number',
      columnType: 'bigint',
    },
    createdBy: {
      model:'User'
    },
    updatedBy: {
      model:'User'
    },
    department:{
      model:'Department'
    }
  },

};
