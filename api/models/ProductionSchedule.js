/**
 * ProductionSchedule.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    createdBy:{
      model:'AppUser'
    },
    estimatedCompletionDate:{
      type:'number'
    },
    actualCompletionDate:{
      type:'number'
    },
    status:{
      type:'string'
    }
  },

};

