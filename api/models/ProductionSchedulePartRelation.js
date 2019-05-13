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
      model:'Partnumber'
    },
    requestedQuantity:{
      type:'string'
    },
    status:{
      type:'string'
    },
    createdBy:{
      model:'AppUser'
    },
    estimatedCompletionDate:{
      type:'string'
    }
  },

};

