/**
 * Processsequence.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    partId:{
      model:'PartNumber'
    },
    sequenceNumber:{
      type:'number',
      columnType: 'integer',
    },
    loadingTime:{
      type:'number',
      columnType: 'integer',
    },
    processTime:{
      type:'number',
      columnType: 'integer',
    },
    unloadingTime:{
      type:'number',
      columnType: 'integer',
    },
    cycleTime:{ // looks lthis is again summation of loadingTime + processTime + unloadingTime
      type:'number',
      columnType: 'integer',
    },
    machineGroupId:{
      model:'MachineGroup'
    },
    isGroup:{
      type:'boolean'
    },
    status:{
      type:'number',
      columnType: 'integer',
    }
  },

};
