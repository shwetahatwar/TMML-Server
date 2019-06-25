/**
 * Partnumber.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    partNumber:{
      type:'string',
      unique: true
    },
    description:{
      type:'string'
    },
    manPower:{
      type:'number'
    },
    SMH:{
      type:'number'   // this will be calculated based on cycle time (represented in hours)
    },
    rawMaterialId:{
      model:'RawMaterial'
    },
    partCreationDate: { // coming from SAP
      type:'number'
    },
    partChangeDate: { // coming from SAP
      type:'number'
    },
    partStatus: { // coming from SAP
      type:'string' //N- New, C – Changed, B- Blocked
    },
    createdBy: {
      model:'User'
    },
    updatedBy: {
      model:'User'
    },
    processSequences: {
      collection:'Processsequence',
      via: 'partId',
    },
    status:{
      type:'number'
    },
    uom: { // unit of measurement coming from SAP
      type: 'string',
    },
    materialGroup: { // coming from SAP
      type: 'string',
    },
  },

};
