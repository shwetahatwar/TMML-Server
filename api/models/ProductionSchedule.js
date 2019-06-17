/**
 * ProductionSchedule.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    productionScheduleId:{
      type:'string',
      unique: true
    },
    createdBy:{
      model:'User'
    },
    scheduleDate: { // a date for which schedule is created
      type:'number'
    },
    estimatedCompletionDate:{
      type:'number'
    },
    actualCompletionDate:{
      type:'number'
    },
    partNumberMonthlyRequiredQuota: {
      model: 'PartNumberRequiredQuota'
    },
    status:{
      type:'string' // New, In Progress, Completed?
    }
  },

};
