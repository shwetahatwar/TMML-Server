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
        dirname: 'C:\\All Projects\\TMML\\New Server\\server\\uploads\\PartNumber',
        filename:'new'
      },async function whenDone(err, uploadedFiles) {
        if (err) {
          sails.log.error('Error uploading file', err)
        }
        console.log(uploadedFiles[0].fd);
        var rejectedPart = new Array();
        // var workbook = XLSX.readFile(uploadedFiles[0].fd);
        // var sheet = workbook.Sheets[workbook.SheetNames[0]];
        // var num_rows = xls_utils.decode_range(sheet['!ref']).e.r;

        // var productionScheduleId = xls_utils.encode_cell({c:0, r:2});
        // var productionScheduleIdValue = sheet[productionScheduleId];
        // console.log(productionScheduleIdValue['v']);
        // var checkFlag = 0;
        // var productionSchedule = await ProductionSchedule.create({
        //   productionScheduleId:productionScheduleIdValue['v'],
        //   estimatedComplitionDate:0,
        //   status: 0
        // })
        // .fetch()
        // .catch(error=>{checkFlag = 1});
        // return res.status(200).send(productionSchedule);
        // if(checkFlag == 0){
          for(var i = 1, l = num_rows; i <= l; i++){
            var partNumber = xls_utils.encode_cell({c:0, r:i});
            var partNumberValue = sheet[partNumber];
            var estimatedComplitionDate = xls_utils.encode_cell({c:4, r:i});
            var estimatedComplitionDateValue = sheet[estimatedComplitionDate];
            var partNumberId = xls_utils.encode_cell({c:1, r:i});
            var partNumberIdValue = sheet[partNumberId];
            console.log(partNumberIdValue);
            var partNumberNameIdValue;

            await PartNumber.findOne({
              where:{'partNumber': partNumberIdValue['v']}
            })
            .then((newPartNumberId)=>{partNumberNameIdValue = newPartNumberId["id"]});

            await ProductionSchedulePartRelation.create({
              requestedQuantity:quantityValue['v'],
              status:"0",
              estimatedCompletionDate:estimatedComplitionDateValue['v'],
              scheduleId:productionSchedule["id"],
              partNumberId:partNumberNameIdValue
            })
            .catch(error=>{rejectedPart.push(partNumberIdValue['v']),console.log(error)})
          }
          return res.status(200).send(rejectedPart);
        // }
        // else{
        //   res.status(400).send("Duplicate Production Schedule");
        // }
      })
    }
  }
};