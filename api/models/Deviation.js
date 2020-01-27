/**
 * Deviation.js
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
    originalQuantity:{
      type:'number',
      columnType: 'integer'
    },
    deviationQuantity:{
      type:'number',
      columnType: 'integer'
    },
    inductionDate:{
      type:'string'
    },
    planFor:{
      type:'string'
    },
    createdBy:{
      model:'User'
    }
  },
};
