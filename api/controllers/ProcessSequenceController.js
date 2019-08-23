/**
 * ProcesssequenceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  bulkUpload: async function(req,res){
    //Part Number ProcessSequence
    console.log(req.body.partNumberProcessSequenceBulkUpload);
    var partNumberProcessSequenceBulkUpload = JSON.parse(req.body.partNumberProcessSequenceBulkUpload);
    if(partNumberProcessSequenceBulkUpload != null && partNumberProcessSequenceBulkUpload != undefined){
      console.log("Line 14", partNumberProcessSequenceBulkUpload[0]);
      for(var i=0; i<partNumberProcessSequenceBulkUpload.length; i++){
        var partNumberBulkUpload = await PartNumber.find({
          where: {partNumber: partNumberProcessSequenceBulkUpload[i].partNumber},
          select: ['id']
        });
        // console.log("line 18" ,partNumberBulkUpload[0]["id"]);
        // console.log("line 20", partNumberProcessSequenceBulkUpload[i].SMH);
        if(partNumberBulkUpload[0] != null && partNumberBulkUpload[0] != undefined){
          // console.log("line 22" ,partNumberBulkUpload[0]);
          // console.log("Line 23",partNumberProcessSequenceBulkUpload[i].SMH);
          var manPower = partNumberProcessSequenceBulkUpload[i].manPower;
          var SMH = partNumberProcessSequenceBulkUpload[i].SMH;
          await PartNumber.update({
            partNumber:partNumberProcessSequenceBulkUpload[i].partNumber
          })
          .set({
            manPower:partNumberProcessSequenceBulkUpload[i].manPower,
            SMH:partNumberProcessSequenceBulkUpload[i].SMH
          });
          // var partcheck = await PartNumber.find({
          // partNumber: partNumberProcessSequenceBulkUpload[i].partNumber
        // });
        // console.log(partcheck);
        // break;
          var j=1;
          var processName1 = partNumberProcessSequenceBulkUpload[i].process_1;
          var processLoding1 = partNumberProcessSequenceBulkUpload[i].loadingTimeP1;
          var processprocess1 = partNumberProcessSequenceBulkUpload[i].processTimeP1;
          var processunloading1 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP1;
          var processcycle1 = partNumberProcessSequenceBulkUpload[i].CycleTimeP1;

          if(processName1 != null && processName1 != undefined)
          await processCreate(processName1,partNumberBulkUpload[0]["id"],j,processLoding1,processprocess1,processunloading1,processcycle1);

          var processName2 = partNumberProcessSequenceBulkUpload[i].process_2;
          var processLoding2 = partNumberProcessSequenceBulkUpload[i].loadingTimeP2;
          var processprocess2 = partNumberProcessSequenceBulkUpload[i].processTimeP2;
          var processunloading2 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP2;
          var processcycle2 = partNumberProcessSequenceBulkUpload[i].CycleTimeP2;
          j++;

          if(processName2 != null && processName2 != undefined)
          await processCreate(processName2,partNumberBulkUpload[0]["id"],j,processLoding2,processprocess2,processunloading2,processcycle2);

          var processName3 = partNumberProcessSequenceBulkUpload[i].process_3;
          var processLoding3 = partNumberProcessSequenceBulkUpload[i].loadingTimeP3;
          var processprocess3 = partNumberProcessSequenceBulkUpload[i].processTimeP3;
          var processunloading3 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP3;
          var processcycle3 = partNumberProcessSequenceBulkUpload[i].CycleTimeP3;
          j++;

          console.log(processName3,processLoding3,processprocess3,processunloading3,processcycle3);
          if(processName3 != null && processName3 != undefined)
          await processCreate(processName3,partNumberBulkUpload[0]["id"],j,processLoding3,processprocess3,processunloading3,processcycle3);

          var processName4 = partNumberProcessSequenceBulkUpload[i].process_4;
          var processLoding4 = partNumberProcessSequenceBulkUpload[i].loadingTimeP4;
          var processprocess4 = partNumberProcessSequenceBulkUpload[i].processTimeP4;
          var processunloading4 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP4;
          var processcycle4 = partNumberProcessSequenceBulkUpload[i].CycleTimeP4;
          j++;

          if(processName4 != null && processName4 != undefined)
          await processCreate(processName4,partNumberBulkUpload[0]["id"],j,processLoding4,processprocess4,processunloading4,processcycle4);

          var processName5 = partNumberProcessSequenceBulkUpload[i].process_5;
          var processLoding5 = partNumberProcessSequenceBulkUpload[i].loadingTimeP5;
          var processprocess5 = partNumberProcessSequenceBulkUpload[i].processTimeP5;
          var processunloading5 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP5;
          var processcycle5 = partNumberProcessSequenceBulkUpload[i].CycleTimeP5;
          j++;

          if(processName5 != null && processName5 != undefined)
          await processCreate(processName5,partNumberBulkUpload[0]["id"],j,processLoding5,processprocess5,processunloading5,processcycle5);

          var processName6 = partNumberProcessSequenceBulkUpload[i].process_6;
          var processLoding6 = partNumberProcessSequenceBulkUpload[i].loadingTimeP6;
          var processprocess6 = partNumberProcessSequenceBulkUpload[i].processTimeP6;
          var processunloading6 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP6;
          var processcycle6 = partNumberProcessSequenceBulkUpload[i].CycleTimeP6;
          j++;

          if(processName6 != null && processName6 != undefined)
          await processCreate(processName6,partNumberBulkUpload[0]["id"],j,processLoding6,processprocess6,processunloading6,processcycle6);

          var processName7 = partNumberProcessSequenceBulkUpload[i].process_7;
          var processLoding7 = partNumberProcessSequenceBulkUpload[i].loadingTimeP7;
          var processprocess7 = partNumberProcessSequenceBulkUpload[i].processTimeP7;
          var processunloading7 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP7;
          var processcycle7 = partNumberProcessSequenceBulkUpload[i].CycleTimeP7;
          j++;

          if(processName7 != null && processName7 != undefined)
          await processCreate(processName7,partNumberBulkUpload[0]["id"],j,processLoding7,processprocess7,processunloading7,processcycle7);

          var processName8 = partNumberProcessSequenceBulkUpload[i].process_8;
          var processLoding8 = partNumberProcessSequenceBulkUpload[i].loadingTimeP8;
          var processprocess8 = partNumberProcessSequenceBulkUpload[i].processTimeP8;
          var processunloading8 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP8;
          var processcycle8 = partNumberProcessSequenceBulkUpload[i].CycleTimeP8;
          j++;

          if(processName8 != null && processName8 != undefined)
          await processCreate(processName8,partNumberBulkUpload[0]["id"],j,processLoding8,processprocess8,processunloading8,processcycle8);

          var processName9 = partNumberProcessSequenceBulkUpload[i].process_9;
          var processLoding9 = partNumberProcessSequenceBulkUpload[i].loadingTimeP9;
          var processprocess9 = partNumberProcessSequenceBulkUpload[i].processTimeP9;
          var processunloading9 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP9;
          var processcycle9 = partNumberProcessSequenceBulkUpload[i].CycleTimeP9;
          j++;

          if(processName9 != null && processName9 != undefined)
          await processCreate(processName9,partNumberBulkUpload[0]["id"],j,processLoding9,processprocess9,processunloading9,processcycle9);

          var processName10 = partNumberProcessSequenceBulkUpload[i].process_10;
          var processLoding10 = partNumberProcessSequenceBulkUpload[i].loadingTimeP10;
          var processprocess10 = partNumberProcessSequenceBulkUpload[i].processTimeP10;
          var processunloading10 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP10;
          var processcycle10 = partNumberProcessSequenceBulkUpload[i].CycleTimeP10;
          j++;

          if(processName10 != null && processName10 != undefined)
          await processCreate(processName10,partNumberBulkUpload[0]["id"],j,processLoding10,processprocess10,processunloading10,processcycle10);

        }
      }
    }
    res.send();
  }
};

async function processCreate(processName,newPartNumberId,count,processLoding,processprocess,processunloading,processcycle){
  console.log("In Process Create",processName,newPartNumberId,count,processLoding,processprocess,processunloading,processcycle);
  if(processName != null && processName != undefined){
      var machineGroupId = await MachineGroup.find({
        where: {name:processName},
        select: ['id']
      });
      if(machineGroupId[0] != null && machineGroupId[0] != undefined){
        var getProcessSequence = await ProcessSequence.find({
          where: {
            partId:newPartNumberId,
            sequenceNumber:count,
            machineGroupId:machineGroupId[0]["id"]
          },
          select: ['id']
        });
        if(getProcessSequence[0] != null && getProcessSequence[0] != undefined){
        }
        else{
          await ProcessSequence.create({
            partId:newPartNumberId,
            sequenceNumber:count,
            loadingTime: processLoding,
            processTime:processprocess,
            unloadingTime:processunloading,
            cycleTime:processcycle,
            machineGroupId:machineGroupId[0]["id"],
            isGroup:true
          })
          .catch(error=>{console.log(error)});
          console.log("line 142", machineGroupId);


          var newProcessSequenceId = await ProcessSequence.find({
            where: {
              partId:newPartNumberId,
              sequenceNumber:count
            },
            select: ['id']
          });

          console.log("line 149",newProcessSequenceId);

          var machineGroupNew = await Machine.find()
          .populate('machineGroupId');
          var machineGroupMachines = [];
          for(var i=0;i<machineGroupNew.length;i++){
            if(machineGroupId[0]["id"] == machineGroupNew[i]["machineGroupId"][0]["id"]){
              machineGroupMachines.push(machineGroupNew[i]["machineName"]);
            }
          }
          // var machineGroupMachines = await Machine.find({where:{machineGroupId:machineGroupId[0]["id"]}});
          console.log(machineGroupMachines);
          for(var machineCount = 0;machineCount<machineGroupMachines.length;machineCount++){
            var machineIdValue;
            var newMachineId = await Machine.find({
              where: {machineName:machineGroupMachines[machineCount]["machineName"]},
              select: ['id']
            });
            if(newMachineId[0] != null && newMachineId[0] != undefined && newProcessSequenceId[0] != null && newProcessSequenceId[0] != undefined){
              await ProcessSequenceMachineRelation.create({
                processSequenceId:newProcessSequenceId[0]["id"],
                machineId:newMachineId[0]["id"]
              })
              .catch((error)=>{console.log(error)});
            }
          }
        }
      }
    }
}
