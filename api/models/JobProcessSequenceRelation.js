/**
 * JobProcessSequenceRelation.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    jobId:{
      model:'JobCard'
    },
    processSequenceId:{
      model:'ProcessSequence'
    },
    machineId:{
      model:'Machine'
    },
    locationId:{
      model:'Location'
    },
    quantity:{
      type:'number'
    },
    note:{
      type:'string'
    },
    status:{
      type:'string'
    },
    createdBy:{
      model:'User'
    },
    startTime:{
      type:'number'
    },
    endTime:{
      type:'number'
    },
    duration:{
      type:'number'
    },
    operatorId:{
      model:'User'
    },

  },

};
