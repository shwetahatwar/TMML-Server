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
        type: 'number',
        columnType: 'bigint',
    },
    startTime: {
        type: 'number',
        columnType: 'bigint',
    },
    endTime: {
        type: 'number',
        columnType: 'bigint',
    },
    multifactor: {
        type: 'number',
        columnType: 'bigint',
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

