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
        // console.log(uploadedFiles[0].fd);
        var rejectedPart = new Array();
        var checkFlag = 0;
        var workbook = XLSX.readFile(uploadedFiles[0].fd);
        var sheet = workbook.Sheets[workbook.SheetNames[0]];
        var num_rows = xls_utils.decode_range(sheet['!ref']).e.r;

        for(var i = 1, l = num_rows; i <= l; i++){
          var partNumber = xls_utils.encode_cell({c:0, r:i});
          var partNumberValue = sheet[partNumber];
          var description = xls_utils.encode_cell({c:3, r:i});
          var descriptionValue = sheet[description];
          var manPower = xls_utils.encode_cell({c:1, r:i});
          var manPowerValue = sheet[manPower];
          var SMH = xls_utils.encode_cell({c:2, r:i});
          var newSMHValue = sheet[SMH];
          var rawMaterial = xls_utils.encode_cell({c:4, r:i});
          var rawMaterialValue = sheet[rawMaterial];
          var rawMaterialNameIdValue;
          // console.log(rawMaterialValue['v']);
          if(rawMaterialValue!=undefined&&rawMaterialValue!=null){
            await Rawmaterial.findOne({
              where:{'rawMaterialNumber': rawMaterialValue['v']}
            })
            .then((newRawMaterialId)=>{rawMaterialNameIdValue = newRawMaterialId["id"]})
            .catch((error)=>{console.log(error)});
          }
          if(rawMaterialNameIdValue!=null&&rawMaterialNameIdValue!=undefined&&partNumberValue!=null&&partNumberValue!=undefined){
            var newPartNumberId = await PartNumber.create({
              partNumber:partNumberValue['v'],
              description:descriptionValue['v'],
              manPower:manPowerValue['v'],
              SMH:newSMHValue['v'],
              rawMaterialId:rawMaterialNameIdValue,
              jcCreateStatus:1
            })
            .fetch()
            .catch(error=>{rejectedPart.push(partNumberValue['v'])});
            if(newPartNumberId != null)
              checkFlag = 0;
            else
              checkFlag = 1;
            if(checkFlag == 0){
              var count=0;
              for(var j = 5; j <= 100; j=j+5){

                var sequenceNumber = xls_utils.encode_cell({c:j, r:i});
                var sequenceNumberValue = sheet[sequenceNumber];
                // console.log(sequenceNumber)
                if(sequenceNumberValue != null){
                  count++;
                  // console.log(count);
                  var loadingTime = xls_utils.encode_cell({c:j+1, r:i});
                  var loadingTimeValue = sheet[loadingTime];
                  var processTime = xls_utils.encode_cell({c:j+2, r:i});
                  var processTimeValue = sheet[processTime];
                  var unloadingTime = xls_utils.encode_cell({c:j+3, r:i});
                  var unloadingTimeValue = sheet[unloadingTime];
                  var cycleTime = xls_utils.encode_cell({c:j+4, r:i});
                  var cycleTimeValue = sheet[cycleTime];
                  var machineGroupId = xls_utils.encode_cell({c:j, r:i});
                  var machineGroupIdValue = sheet[machineGroupId];
                  var machineGroupIdNameValue;
                  var isGroupName;
                  var ProcessSequenceId;
                  await Machinegroup.findOne({
                    where:{'name':machineGroupIdValue['v']}
                  })
                  .then((newMachineGroupIdNameValue)=>{machineGroupIdNameValue = newMachineGroupIdNameValue["id"],isGroupName=true,console.log(machineGroupIdNameValue)})
                  .catch(error=>{console.log("No Group")});

                  if(machineGroupIdNameValue == null){
                    await Machine.findOne({
                      where:{'name':machineGroupIdValue['v']}
                    })
                    .then((newMachineGroupIdNameValue)=>{machineGroupIdNameValue = newMachineGroupIdNameValue["id"],isGroupName=false})
                    .catch(error=>{console.log("No Machine")})
                  }
                  var newProcessSequenceId = await ProcessSequence.create({
                    partId:newPartNumberId["id"],
                    sequenceNumber:count,
                    loadingTime: loadingTimeValue['v'],
                    processTime:processTime['v'],
                    machineGroupId:machineGroupIdNameValue,
                    isGroup:isGroupName
                  })
                  .fetch()
                  .catch(error=>{console.log(error)});
                  ProcessSequenceId=newProcessSequenceId;
                  // console.log(ProcessSequenceId,"newProcessSequenceId");
                  if(isGroupName == true){
                    // console.log("If");
                    // console.log(machineGroupIdNameValue,"machineGroupIdNameValue");
                    var machines = await Machine.find({machineGroupId:machineGroupIdNameValue})
                    console.log(machines);
                    for(var machineCount = 0;machineCount<machines.length;machineCount++){
                      console.log(machineCount);
                      await ProcessSequenceMachineRelation.create({
                        processSequenceId:newProcessSequenceId["id"],
                        machineId:machines[machineCount]["id"]
                      })
                    }
                  }
                  else{
                    // console.log("Else");
                    // console.log(newProcessSequenceId);
                    await ProcessSequenceMachineRelation.create({
                        processSequenceId:newProcessSequenceId["id"],
                        machineId:machineGroupIdNameValue
                      })
                  }
                }
                else{
                  break;
                }
              }
            }
          }
        }
        return res.status(200).send(rejectedPart);
        sails.log.error("Part Numbers not uploaded in software",rejectedPart);
      })
    }
  }
};
