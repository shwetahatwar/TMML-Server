/**
 * JobProcessSequenceTransaction.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    jobCardId :{
      model:'JobCard'
    },
    jobProcessSequenceRelation:{
      model:'JobProcessSequenceRelation'
    },
    quantity:{
      type:'number',
      columnType: 'bigint',
    }
  },
};

