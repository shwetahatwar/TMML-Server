/**
 * AppTrolley.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    capacity:{
      type:'string'
    },
    typeId:{
      model:'TrolleyType'
    },
    materialTypeId:{
      model:'MaterialType'
    },
    barcodeSerial:{
      type:'string'
    },
    status:{
      type:'string'
    },
    createdBy:{
      model:'User'
    }
  },

};

