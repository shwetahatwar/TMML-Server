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
      model:'Processsequence'
    },
    toJobId:{
      model:'JobCard'
    },
    toProcessSequenceId:{
      model:'Processsequence'
    },
    quantity:{
      type:'number'
    }
  },

};

