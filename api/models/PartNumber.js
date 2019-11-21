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
      columnType: '_stringkey',
      unique: true,
      required: true
    },
    description:{
      type:'string'
    },
    manPower:{
      type:'number',
      columnType: 'float',
    },
    SMH:{
      type:'number',   // this will be calculated based on cycle time (represented in hours)
      columnType: 'float',
    },
    rawMaterialId:{
      model:'RawMaterial'
    },
    partCreationDate: { // coming from SAP
      type:'string',
    },
    partChangeDate: { // coming from SAP
      type:'string',
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
      type:'number',
      columnType: 'integer',
    },
    uom: { // unit of measurement coming from SAP
      type: 'string',
    },
    materialGroup: { // coming from SAP
      type: 'string',
    },
    rawMaterialQuantity: {
      type: 'number',
      columnType: 'float',
    },
    kanbanLocation:{
      model:'Location'
    },
    remarks:{
      type: 'string',
      defaultsTo: 'NA'
    }
  },

};
