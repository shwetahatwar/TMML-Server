/**
 * ProductionSchedulePartRelation.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    scheduleId:{
      model:'ProductionSchedule'
    },
    partNumberId:{
      model:'PartNumber'
    },
    requestedQuantity:{
      type:'number',
      columnType: 'integer',
    },
    scheduleStatus:{
      type:'string'
    },
    inductionDate:{
      type:'string'
    },
    planFor:{
      type:'string'
    },
    createdBy:{
      model:'User'
    },
    estimatedCompletionDate:{
      type:'number',
      columnType: 'bigint',
    },
    isJobCardCreated:{ // this should be bool right?
      type:'number',
      columnType: 'integer',
    },
    jobcard: {
      collection: 'JobCard',
      via: 'productionSchedulePartRelationId',
    },
    partRemark: {
      type: 'string'
    },
  },
};
