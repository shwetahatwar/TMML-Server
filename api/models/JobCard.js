/**
 * JobCard.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    productionSchedulePartRelationId:{
      model:'ProductionSchedulePartRelation'
    },
    trolleyId:{
      model:'AppTrolley'
    },
    requestedQuantity:{
      type:'number'
    },
    actualQuantity:{
      type:'number'
    },
    status:{
      type:'number'
    },
    estimatedDate:{
      type:'string'
    },
    createdBy:{
      model:'AppUser'
    },
    updatedBy:{
      model:'AppUser'
    }
  },

};

