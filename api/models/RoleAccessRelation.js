/**
 * RoleAccessRelation.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    userId: {
      model:'AppUser'
    },
    accessId:{
        model:'AccessLevel'
    },
  },

};

