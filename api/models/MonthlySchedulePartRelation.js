/**
 * MonthlySchedulePartRelation.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    monthlyScheduleId:{
      model:'MonthlySchedule'
    },
    partNumber:{
      model:'PartNumber'
    },
    description:{
      type:'string'
    },
    UOM:{
      type:'string'
    },
    proc:{
      type:'string'
    },
    EP:{
      type:'string'
    },
    issueLoc:{
      type:'string'
    },
    requiredInMonth:{
      type:'string'
    },
    CAT:{
      type:'string' //MAT, SRF, EVR, IB
    }

  },

};

