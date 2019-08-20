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
      type:'number',
      columnType: 'integer',
    },
    sourceLocation:{
      model:'Location'
    },
    destinationLocationId:{
      model:'Location'
    },
    suggestedDropLocations:{
      type:'string'
    },
    processStatus:{  //Pending, Picked, Completed
      type:'string'
    },
  },

};
