/**
 * ProductionSchedule.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    productionScheduleId:{
      type:'string', // Machine Shop Daily Plan YYYY-MM-DD-NNN (where NNN is serial number from 001 to 999)
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
    scheduleStatus:{
      type:'string' // New, In Progress, Completed?
    },
    status: {
      type: 'number' // New, In Progress, Completed?
    },
    partNumberMonthlyRequiredQuota: {
      model: 'PartNumberRequiredQuota'
    },
    parts: {
      collection: 'ProductionSchedulePartRelation',
      via: 'scheduleId',
    },
    scheduleType: {
      type:'string',
      isIn: ['Scheduled', 'Nesting RM Optimization', 'Design Change'],
      defaultsTo: 'Scheduled',
    },
    remarks: {
      type: 'string',
    }
  },

};
