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
      type:'number',
      columnType: 'integer',
    },
    actualQuantity:{
      type:'number',
      columnType: 'integer',
    },
    status:{
      type:'number',
      columnType: 'integer',
    },
    jobcardStatus:{
      type:'string' // New, Pending for Raw Material, Under Processing, Completed
    },
    estimatedDate:{
      type:'string'
    },
    barcodeSerial:{
      type:'string'
    },
    kanbanLocation:{ // this can be Kanban location instead of current location.
      model:'Location'
    },
    createdBy:{
      model:'User'
    },
    updatedBy:{
      model:'User'
    },
    processes: {
      collection: 'JobProcessSequenceRelation',
      via: 'jobId'
    }
  },

};
