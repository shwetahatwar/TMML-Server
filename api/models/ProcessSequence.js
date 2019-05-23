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
      type:'number'
    },
    loadingTime:{
      type:'number'
    },
    processTime:{
      type:'number'
    },
    unloadingTime:{
      type:'number'
    },
    cycleTime:{
      type:'number'
    },
    machineGroupId:{
      model:'MachineGroup'
    },
    isGroup:{
      type:'boolean'
    }
  },

};

