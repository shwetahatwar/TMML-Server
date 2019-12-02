module.exports = {

  attributes: {
    name:{
      type:'string',
      columnType: '_stringkey',
      unique: true,
      required: true
    },
    email:{
      type:'string'
    },
  },

};