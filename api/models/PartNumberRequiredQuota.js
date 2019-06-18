/**
 * PartNumberRequiredQuota.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    partNumber:{
      model:'PartNumber',
    },
    requiredQuantity: {
      type:'number',
    },
    monthYear: {
      type: 'number'
    },
    componentDetails: { // a chesis or component where this part will be consumed
      type: 'string',
    },
  },
};
