/**
 * Shift.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name:{
      type:'string',
    },
    startTimeInSeconds:{
      type:'number', // seconds from 86400 from mid-night
      columnType: 'bigint',
    },
    endTimeInSeconds:{
      type:'number',
      columnType: 'bigint',
    },
    teaBreakStartInSeconds:{
      type:'number',
      columnType: 'bigint',
    },
    teaBreakEndInSeconds:{
      type:'number',
      columnType: 'bigint',
    },
    lunchBreakStartInSeconds:{
      type:'number',
      columnType: 'bigint',
    },
    lunchBreakEndInSeconds:{
      type:'number',
      columnType: 'bigint',
    },
    cell:{
      model:'Cell',
    }

  },

};
