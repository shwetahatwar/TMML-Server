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
      columnType: 'bigint',
    },
    loadingTime:{
      type:'number',
      columnType: 'bigint',
    },
    processTime:{
      type:'number',
      columnType: 'bigint',
    },
    unloadingTime:{
      type:'number',
      columnType: 'bigint',
    },
    cycleTime:{ // looks lthis is again summation of loadingTime + processTime + unloadingTime
      type:'number',
      columnType: 'bigint',
    },
    machineGroupId:{
      model:'MachineGroup'
    },
    isGroup:{
      type:'boolean'
    }
  },

};
