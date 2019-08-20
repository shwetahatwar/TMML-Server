/**
 * JobToJobRerouting.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    fromJobId:{
      model:'JobCard'
    },
    fromProcessSequenceId:{
      model:'ProcessSequence'
    },
    toJobId:{
      model:'JobCard'
    },
    toProcessSequenceId:{
      model:'ProcessSequence'
    },
    quantity:{
      type:'number',
      columnType: 'integer',
    }
  },

};

