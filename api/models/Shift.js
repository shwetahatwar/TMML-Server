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
      unique: true
    },
    startTimeInSeconds:{
      type:'number', // seconds from 86400 from mid-night
      unique: true
    },
    endTimeInSeconds:{
      type:'number',
      unique: true
    },
    teaBreakStartInSeconds:{
      type:'number',
      unique: true
    },
    teaBreakEndInSeconds:{
      type:'number',
      unique: true
    },
    lunchBreakStartInSeconds:{
      type:'number',
      unique: true
    },
    lunchBreakEndInSeconds:{
      type:'number',
      unique: true
    },
    cell:{
      model:'Cell',
    }

  },

};
