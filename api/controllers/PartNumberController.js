/**
 * PartnumberController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function(req,res){
    var rawMaterialNameIdValue;
    await Rawmaterial.findOne({
      where:{'rawMaterialNumber': req.body.rawMaterial.materialNumber}
    })
    .then((newRawMaterialId)=>{rawMaterialNameIdValue = newRawMaterialId["id"]});

    var newPartNumberId = await PartNumber.create({
      partNumber:req.body.partnumber,
      description:req.body.description,
      manPower:req.body.manpower,
      SMH:req.body.smh,
      rawMaterialId:rawMaterialNameIdValue,
      status:1
    })
    .fetch()
    .catch(error=>{console.log(error)});

    for(var i=0;i<req.body.processes.length;i++){
      var isGroupName;
      var j = i+1;
      // console.log(req.body.processes[i].machines.length)
      if(req.body.processes[i].machines.length == 0)
        isGroupName = true;
      else
        isGroupName = false;
      // console.log(isGroupName);
      var machineGroupId;
      await MachineGroup.findOne({
        where:{'name':req.body.processes[i].machineGroupName}
      })
      .then((newMachineGroupIdNameValue)=>{machineGroupId = newMachineGroupIdNameValue["id"]})
      .catch(error=>{console.log("No Group")});
      // console.log(machineGroupId);
      var newProcessSequenceId = await ProcessSequence.create({
        partId:newPartNumberId["id"],
        sequenceNumber:j,
        loadingTime: req.body.processes[i].loadingTime,
        processTime:req.body.processes[i].processTime,
        unloadingTime:req.body.processes[i].unloadingTime,
        cycleTime:req.body.processes[i].cycleTime,
        machineGroupId:machineGroupId,
        isGroup:isGroupName
      })
      .fetch()
      .catch(error=>{console.log(error)});

      // console.log(newProcessSequenceId);
      if(isGroupName == false){
        console.log(req.body.processes[i].machines.length)
        for(var machineCount = 0;machineCount<req.body.processes[i].machines.length;machineCount++){
          console.log(req.body.processes[i].machines[machineCount].machineName);

          var machineIdValue;
          await Machine.findOne({
            where:{'machineName': req.body.processes[i].machines[machineCount].machineName}
          })
          .then((newMachineId)=>{machineIdValue = newMachineId["id"]});

          console.log(machineIdValue)
          await ProcessSequenceMachineRelation.create({
            processSequenceId:newProcessSequenceId["id"],
            machineId:machineIdValue
          })
          .catch((error)=>{console.log(error)});
        }
      }
      else{
        console.log(machineGroupId);
        var machineGroupMachines = await Machine.find({where:{machineGroupId:machineGroupId}});
        console.log(machineGroupMachines);
        for(var machineCount = 0;machineCount<machineGroupMachines.length;machineCount++){
          var machineIdValue;
          await Machine.findOne({
            where:{'machineName': machineGroupMachines[machineCount].machineName}
          })
          .then((newMachineId)=>{machineIdValue = newMachineId["id"]});

          console.log(machineIdValue)
          await ProcessSequenceMachineRelation.create({
            processSequenceId:newProcessSequenceId["id"],
            machineId:machineIdValue
          })
          .catch((error)=>{console.log(error)});
        }
      }
    }
    res.status(200).send(newPartNumberId);
  },



  newPart: async function(req,res){

    var newPartNumberId = await PartNumber.create({
      partNumber:req.body.partnumber,
      description:req.body.description,
      manPower:req.body.manpower,
      SMH:req.body.smh,
      rawMaterialId:req.body.rawMaterial.id,
      status:req.body.status
    })
    .fetch()
    .catch(error=>{console.log(error)});
    if(newPartNumberId!=null && newPartNumberId!=undefined){
      for(var i=0;i<req.body.processes.length;i++){
        if(req.body.processes[i].machineGroupName!= null && req.body.processes[i].machineGroupName!=undefined&&req.body.processes[i].machineGroupName!=0){
          var isGroupName;
          var j = i+1;
          isGroupName = true;
          console.log(req.body.processes[i].machineGroupName);
          var machineGroupId = req.body.processes[i].machineGroupName;
          var newProcessSequenceId = await ProcessSequence.create({
            partId:newPartNumberId["id"],
            sequenceNumber:j,
            loadingTime: req.body.processes[i].loadingTime,
            processTime:req.body.processes[i].processTime,
            unloadingTime:req.body.processes[i].unloadingTime,
            cycleTime:req.body.processes[i].cycleTime,
            machineGroupId:req.body.processes[i].machineGroupName,
            isGroup:isGroupName
          })
          .fetch()
          .catch(error=>{console.log(error)});

          // console.log(newProcessSequenceId);
          if(newProcessSequenceId!=null&&newProcessSequenceId!=undefined){
            if(isGroupName == false){
              // console.log(req.body.processes[i].machines.length)
              for(var machineCount = 0;machineCount<req.body.processes[i].machines.length;machineCount++){
                // console.log(req.body.processes[i].machines[machineCount].machineName);

                var machineIdValue;
                await Machine.findOne({
                  where:{'machineName': req.body.processes[i].machines[machineCount].machineName}
                })
                .then((newMachineId)=>{machineIdValue = newMachineId["id"]});

                // console.log(machineIdValue)
                await ProcessSequenceMachineRelation.create({
                  processSequenceId:newProcessSequenceId["id"],
                  machineId:machineIdValue
                })
                .catch((error)=>{console.log(error)});
              }
            }
            else{
              // console.log(machineGroupId);
              var machineGroupMachines = await Machine.find({where:{machineGroupId:machineGroupId}});
              // console.log(machineGroupMachines);
              for(var machineCount = 0;machineCount<machineGroupMachines.length;machineCount++){
                var machineIdValue;
                await Machine.findOne({
                  where:{'machineName': machineGroupMachines[machineCount].machineName}
                })
                .then((newMachineId)=>{machineIdValue = newMachineId["id"]});

                // console.log(machineIdValue);
                await ProcessSequenceMachineRelation.create({
                  processSequenceId:newProcessSequenceId["id"],
                  machineId:machineIdValue
                })
                .catch((error)=>{console.log(error)});
              }
            }
          }
        }
      }
    }
    res.status(200).send(newPartNumberId);
  }
};

