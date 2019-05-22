var XLSX = require('xlsx'),
    xls_utils = XLSX.utils;

module.exports={

  test : async function(req,res){
    var rejectedMaterial = new Array();
    const mediaFile = req.file('media')
    if (!mediaFile._files[0]) {
        sails.log.warn('No file uploaded')
        clearTimeout(mediaFile.timeouts.untilMaxBufferTimer)
        clearTimeout(mediaFile.timeouts.untilFirstFileTimer)
        return res.send('no file given!')
    }
    else{
      req.file('media').upload({
        dirname: 'C:\\All Projects\\TMML\\New Server\\server\\uploads\\RawMaterial',
        filename:'new'
      },async function whenDone(err, uploadedFiles) {
        if (err) {
          sails.log.error('Error uploading file', err)
        }
        console.log(uploadedFiles[0].fd);

        var workbook = XLSX.readFile(uploadedFiles[0].fd);
        var sheet = workbook.Sheets[workbook.SheetNames[0]];
        var num_rows = xls_utils.decode_range(sheet['!ref']).e.r;
        for(var i = 1, l = num_rows; i <= l; i++){
          var name = xls_utils.encode_cell({c:0, r:i});
          var value = sheet[name];
          var description = xls_utils.encode_cell({c:1, r:i});
          var descriptionValue = sheet[description];
          var materialTypeId = xls_utils.encode_cell({c:2, r:i});
          var materialTypeIdValue = sheet[materialTypeId];
          var rawMaterialNumber = xls_utils.encode_cell({c:3, r:i});
          var rawMaterialNumberValue = sheet[rawMaterialNumber];
          var materialTypeIdNameValues;
          
          await MaterialType.findOne({
            where:{'name':materialTypeIdValue['v']}
          })
          .then((materialTypeId)=>{materialTypeIdNameValues = materialTypeId["id"]});
            await RawMaterial.create({
              rawMaterialNumber:rawMaterialNumberValue['v'],
              name:value['v'],
              description:descriptionValue['v'],
              materialTypeId:materialTypeIdNameValues,
              createdBy:req.user,
              updatedBy:req.user
            })
            .catch(error=>{rejectedMaterial.push(rawMaterialNumberValue['v'])});
        }
        return res.status(200).send(rejectedMaterial);
      })
    }
  }
};