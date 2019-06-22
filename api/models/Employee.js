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
      unique: true
    },
    name: {
      type: 'string'
    },
    email:{
      type:'string'
    },
    mobileNumber:{
      type:'string'
    },
    status:{
      type:'number'
    },
    notifyForMachineMaintenance:{
      type:'number'
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
