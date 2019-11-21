/**
 * MonthlySchedule.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    year:{  
      type:'string'
    },
    month:{
      type:'string'
    },
    scheduleName:{ //Machine Shop Daily Plan YYYY-MM 
      type:'string'
    },
    // partNumber:{
    //   model:'PartNumber'
    // },
    // description:{
    //   type:'string'
    // },
    // UOM:{
    //   type:'string'
    // },
    // proc:{
    //   type:'string'
    // },
    // EP:{
    //   type:'string'
    // },
    // issueLoc:{
    //   type:'string'
    // },
    // requiredInMonth:{
    //   type:'number'
    // },
    // CAT:{
    //   type:'string' //MAT, SRF, EVR, IB
    // }
  },

};

