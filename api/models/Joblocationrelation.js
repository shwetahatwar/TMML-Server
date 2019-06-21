/**
 * Joblocationrelation;.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    jobcardId :{
      model:'JobCard'
    },
    jobProcessSequenceRelationId :{
      type:'number'
    },
    sourceLocation:{
      model:'Location'
    },
    destinationLocationId:{
      model:'Location'
    },
    multiplyMachines:{
      type:'string'
    },
    status:{  //Pending, Picked, Completed
      type:'string'
    },
  },

};
