/**
 * Processsequence.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    partId:{
      model:'Partnumber'
    },
    sequenceNumber:{
      type:'string'
    },
    loadingTime:{
      type:'string'
    },
    processTime:{
      type:'string'
    },
    unloadingTime:{
      type:'string'
    },
    machineGroupId:{
      model:'Machinegroup'
    },
    isGroup:{
      type:'string'
    }
  },

};

