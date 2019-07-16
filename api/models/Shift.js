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
    },
    endTimeInSeconds:{
      type:'number',
    },
    teaBreakStartInSeconds:{
      type:'number',
    },
    teaBreakEndInSeconds:{
      type:'number',
    },
    lunchBreakStartInSeconds:{
      type:'number',
    },
    lunchBreakEndInSeconds:{
      type:'number',
    },
    cell:{
      model:'Cell',
    }

  },

};
