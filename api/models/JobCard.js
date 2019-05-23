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
      model:'Trolley'
    },
    requestedQuantity:{
      type:'number'
    },
    actualQuantity:{
      type:'number'
    },
    status:{
      type:'string'
    },
    estimatedDate:{
      type:'number'
    },
    barcodeSerial:{
      type:'string'
    },
    createdBy:{
      model:'User'
    },
    updatedBy:{
      model:'User'
    }
  },

};

