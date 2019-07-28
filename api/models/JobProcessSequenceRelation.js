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
      type:'number',
      columnType: 'bigint',
    },
    note:{
      type:'string'
    },
    processStatus:{ //Complete, Pending, FinalComplete
      type:'string'
    },
    createdBy:{
      model:'User'
    },
    startTime:{
      type:'number',
      columnType: 'bigint',
    },
    endTime:{
      type:'number',
      columnType: 'bigint',
    },
    duration:{
      type:'number',
      columnType: 'bigint',
    },
    operatorId:{
      model:'User'
    },
    sequenceNumber:{
      type:'number',
      columnType: 'bigint',
      allowNull: true
    }
  },

};
