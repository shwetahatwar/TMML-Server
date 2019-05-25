/**
 * MachineStrokes.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    machineId:{
      model:'Machine',
    },
    strokes: {
        type: 'number'
    },
    startTime: {
        type: 'number'
    },
    endTime: {
        type: 'number'
    },
    multifactor: {
        type: 'number',
        defaultsTo: 1
    },
    createdBy: {
      model:'User'
    },
    updatedBy: {
      model:'User'
    },
  },

};

