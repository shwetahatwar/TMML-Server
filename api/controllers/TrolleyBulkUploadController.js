var XLSX = require('xlsx'),
    xls_utils = XLSX.utils;

module.exports={

  upload : async function(req,res){
    
    const mediaFile = req.file('media')
    if (!mediaFile._files[0]) {
        sails.log.warn('No file uploaded')
        clearTimeout(mediaFile.timeouts.untilMaxBufferTimer)
        clearTimeout(mediaFile.timeouts.untilFirstFileTimer)
        return res.send('no file given!')
    }
    else{
      req.file('media').upload({
        dirname: 'C:\\All Projects\\TMML\\New Server\\server\\uploads\\trolley',
        filename:'new'
      },async function whenDone(err, uploadedFiles) {
        if (err) {
          sails.log.error('Error uploading file', err)
        }
        console.log(uploadedFiles[0].fd);
        var rejectedTrolley = new Array();
        var workbook = XLSX.readFile(uploadedFiles[0].fd);
        var sheet = workbook.Sheets[workbook.SheetNames[0]];
        var num_rows = xls_utils.decode_range(sheet['!ref']).e.r;
        for(var i = 1, l = num_rows; i <= l; i++){
          var capacity = xls_utils.encode_cell({c:0, r:i});
          var value = sheet[capacity];
          var typeId = xls_utils.encode_cell({c:1, r:i});
          var typeIdValue = sheet[typeId];
          var materialTypeId = xls_utils.encode_cell({c:2, r:i});
          var materialTypeIdValue = sheet[materialTypeId];
          var typeIdNameValues;
          var materialTypeIdNameValues;

          if(typeIdValue!=null&&typeIdValue!=undefined){
            await Trolleytype.findOne({
              where:{'name':typeIdValue['v']}
            })
            .then((newTypeId)=>{typeIdNameValues = newTypeId["id"]});
          }
          if(materialTypeIdValue!=null&&materialTypeIdValue!=undefined){
            await Materialtype.findOne({
              where:{'name':materialTypeIdValue['v']}
            })
            .then((materialTypeId)=>{materialTypeIdNameValues = materialTypeId["id"]});
          }
          if(typeIdNameValues!=null&&typeIdNameValues!=undefined&&materialTypeIdNameValues!=null&&materialTypeIdNameValues!=undefined)
          {
            await Trolley.create({
              capacity:value['v'],
              typeId:typeIdNameValues,
              materialTypeId:materialTypeIdNameValues,
              barcodeSerial:"A123",
              status:0
            })
            .catch(error=>{rejectedTrolley.push(value['v'])});
          }
        }
        return res.status(200).send(rejectedTrolley);
      })
    }
  }
};