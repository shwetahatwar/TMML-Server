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
      type:'number'
    },
    scheduleStatus:{
      type:'string'
    },
    createdBy:{
      model:'User'
    },
    estimatedCompletionDate:{
      type:'number'
    },
    isJobCardCreated:{ // this should be bool right?
      type:'number'
    },
    jobcard: {
      collection: 'JobCard',
      via: 'productionSchedulePartRelationId',
    },
  },
};
