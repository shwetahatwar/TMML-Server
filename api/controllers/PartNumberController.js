/**
 * PartnumberController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
*/

var request = require('request');
module.exports = {
  create: async function(req,res){
    var rawMaterialNameIdValue;
    await Rawmaterial.findOne({
      where:{'rawMaterialNumber': req.body.rawMaterial.materialNumber}
    })
    .then((newRawMaterialId)=>{rawMaterialNameIdValue = newRawMaterialId["id"]});
    var kanbanLocationId;
    await Location.findOne({
      where:{'name': req.body.kanbanLocation.id}
    })
    .then((newKanbanId)=>{kanbanLocationId = newKanbanId["id"]});
    var newPartNumberId = await PartNumber.create({
      partNumber:req.body.partnumber,
      description:req.body.description,
      manPower:req.body.manpower,
      SMH:req.body.smh,
      rawMaterialId:rawMaterialNameIdValue,
      kanbanLocation:kanbanLocationId,
      status:1
    })
    .fetch()
    .catch(error=>{console.log(error)});
    if(newPartNumberId != null && newPartNumberId != undefined){
      await PartFile.create({
        partId:newPartNumberId["id"],
        fileData:req.body.fileData,
        fileType:req.body.fileType
      })
      .catch(error=>{console.log(error)});
    }
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
    var cycleTime = 0;
    for(var i=0;i<req.body.processes.length;i++){
      cycleTime = cycleTime + parseInt(req.body.processes[i].loadingTime)+parseInt(req.body.processes[i].processTime)+parseInt(req.body.processes[i].unloadingTime);
    }
    var smh = (cycleTime * req.body.manpower)/3600;
    var newPartNumberId = await PartNumber.create({
      partNumber:req.body.partnumber,
      description:req.body.description,
      manPower:req.body.manpower,
      SMH:smh,
      rawMaterialId:req.body.rawMaterial.id,
      status:req.body.status
    })
    .fetch()
    .catch(error=>{console.log(error)});
    if(newPartNumberId!=null && newPartNumberId!=undefined){
      await PartFile.create({
        partId:newPartNumberId["id"],
        fileData:req.body.fileData,
        fileType:req.body.fileType
      })
      .catch(error=>{console.log(error)});
      for(var i=0;i<req.body.processes.length;i++){
        if(req.body.processes[i].machineGroupName!= null && req.body.processes[i].machineGroupName!=undefined&&req.body.processes[i].machineGroupName!=0){
          var isGroupName;
          var j = i+1;
          isGroupName = true;
          console.log(req.body.processes[i].machineGroupName);
          var machineGroupId = req.body.processes[i].machineGroupName;
          var cycleTime = parseInt(req.body.processes[i].loadingTime)+parseInt(req.body.processes[i].processTime)+parseInt(req.body.processes[i].unloadingTime);
          var newProcessSequenceId = await ProcessSequence.create({
            partId:newPartNumberId["id"],
            sequenceNumber:j,
            loadingTime: req.body.processes[i].loadingTime,
            processTime:req.body.processes[i].processTime,
            unloadingTime:req.body.processes[i].unloadingTime,
            cycleTime:cycleTime,
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
              console.log(machineGroupId);
              // if(req.body.machineGroupId)
              var machineGroup = req.body.processes[i].machineGroupName;
              // var machineGroupMachines;
              console.log("Line 175",machineGroup);
              var newURL = "http://localhost:1337/machine_machineGroupId__machinegroup_machines?machine_machineGroupId=" + machineGroup;
              var machineData;
              await request.get({
                url: newURL
              },async function(error, response, body) {
                if (error) {
                  // sails.log.error(error);
                }
                else {
                  // sails.log.info(response);
                  var newBody = JSON.parse(body);
                  console.log("Line 185",newBody);
                  console.log("Line 186",newBody[0]["machinegroup_machines"]["id"]);
                  machineData = body;
                  console.log("Line 188", newBody.length);
                  for(var i=0;i<newBody.length;i++){
                    // console.log("Line 192", newBody[i]["machine_machineGroupId"]);
                    await ProcessSequenceMachineRelation.create({
                      processSequenceId:newProcessSequenceId["id"],
                      machineId:newBody[i]["machinegroup_machines"]["id"]
                    });
                    // console.log("Line 197", newBody[i]["machine_machineGroupId"]["id"]);
                  }
                }  
              });
              
              

              // var machineGroups = await MachineGroup.find({
              //   id:req.body.processes[i].machineGroupName
              // })
              // .populate("machines");
              // console.log("Line 200",machineGroups[0]);
              // var suggestedLocations="";
              // for(var i=0;i<machineGroups[i]["machines"].length;i++){
              //   suggestedLocations = suggestedLocations + "," + machineGroups[0]["machines"][i]["machineName"];
              //   await ProcessSequenceMachineRelation.create({
              //     processSequenceId:newProcessSequenceId["id"],
              //     machineId:machineGroups[i]["machines"][i]["id"]
              //   });
              // }


              // for(var machineCount = 0;machineCount<machineGroupMachine.length;machineCount++){
              //   if(machineGroupMachine[machineCount]["machineGroupId"][0]!=null&&machineGroupMachine[machineCount]["machineGroupId"][0]!=undefined){
              //     await ProcessSequenceMachineRelation.create({
              //       processSequenceId:newProcessSequenceId["id"],
              //       machineId:machineGroupMachine[machineCount]["id"]
              //     });
              //   }
              // }
              // var machineGroupMachine = await Machine.find()
              // .populate('machineGroupId',{where:{id:machineGroupId}});
              // console.log(machineGroupMachine);
              // for(var machineCount = 0;machineCount<machineGroupMachine.length;machineCount++){
              //   if(machineGroupMachine[machineCount]["machineGroupId"][0]!=null&&machineGroupMachine[machineCount]["machineGroupId"][0]!=undefined){
              //     await ProcessSequenceMachineRelation.create({
              //       processSequenceId:newProcessSequenceId["id"],
              //       machineId:machineGroupMachine[machineCount]["id"]
              //     });
              //   }
              // }



              // for(var machineCount = 0;machineCount<machineGroupMachine.length;machineCount++){
              //   // console.log(machineGroupMachine[machineCount]["machineGroupId"][0]);
              //   if(machineGroupMachine[machineCount]["machineGroupId"][0]!=null & machineGroupMachine[machineCount]["machineGroupId"][0]!=undefined){
              //     console.log(machineGroupMachine[machineCount]["machineGroupId"]);
              //   }
              // }
              // for(var j=0;j<machineGroup.length;j++){
              //   var machineGroupMachine = await Machine.find({where:{machineGroupId:machineGroupId}});
              //   console.log(machineGroupMachine);
              //   console.log(machineGroupMachine);
              //   machineGroupMachines.push(machineGroupMachine);
              // }
              // console.log(machineGroupMachines[0]);
              // var machineGroupMachines = await Machine.find({where:{machineGroupId:machineGroupId[0]}});
              // console.log(machineGroupMachines);
              // for(var machineCount = 0;machineCount<machineGroupMachine.length;machineCount++){
              //   var machineIdValue;
              //   await Machine.findOne({
              //     where:{'machineName': machineGroupMachines[machineCount].machineName}
              //   })
              //   .then((newMachineId)=>{machineIdValue = newMachineId["id"]});
              //   // console.log(machineIdValue);
              //   await ProcessSequenceMachineRelation.create({
              //     processSequenceId:newProcessSequenceId["id"],
              //     machineId:machineIdValue
              //   })
              //   .catch((error)=>{console.log(error)});
              // }
            }
          }
        }
      }
    }
    res.status(200).send(newPartNumberId);
  },

  bulkUpload:async function(req,res){
    console.log(req.body.partNumberBulkUpload);
    var partNumberBulkUpload = JSON.parse(req.body.partNumberBulkUpload);
    if(partNumberBulkUpload != null && partNumberBulkUpload != undefined){
      for(var i=0; i<partNumberBulkUpload.length; i++){
        var checkPartNumber = await PartNumber.find({
          partNumber : partNumberBulkUpload[i].partNumber
        });
        if(checkPartNumber[0] != null && checkPartNumber[0] != undefined){

        }
        else{
          var rawMaterial = await RawMaterial.find({
            rawMaterialNumber: partNumberBulkUpload[i].rawMaterialNumber
          });
          if(rawMaterial[0] != null && rawMaterial[0] != undefined){
            var kanbanLocationId;
            var kanbanLocation = await Location.find({
              name: partNumberBulkUpload[i].SAPLocation
            });
            if(kanbanLocation[0] != null && kanbanLocation[0] != undefined){
              kanbanLocationId = kanbanLocation[0]["id"]
            }
            else{
              kanbanLocationId = null
            }
            await PartNumber.create({
              partNumber: partNumberBulkUpload[i].partNumber,
              description: partNumberBulkUpload[i].partDescription,
              rawMaterialId: rawMaterial[0]["id"],
              status: 1,
              materialGroup: partNumberBulkUpload[i].MaterialGroup,
              kanbanLocation: kanbanLocationId
            });
          }
        }
      }
    }
    res.send();
  }
};

/**
* PartnumberController
*
* @description :: Server-side actions for handling incoming requests.
* @help        :: See https://sailsjs.com/docs/concepts/actions
*/
// module.exports = {
//   create: async function(req,res){
//     var rawMaterialNameIdValue;
//     await Rawmaterial.findOne({
//       where:{'rawMaterialNumber': req.body.rawMaterial.materialNumber}
//     })
//     .then((newRawMaterialId)=>{rawMaterialNameIdValue = newRawMaterialId["id"]});
//     var kanbanLocationId;
//     await Location.findOne({
//       where:{'name': req.body.kanbanLocation.id}
//     })
//     .then((newKanbanId)=>{kanbanLocationId = newKanbanId["id"]});
//     var newPartNumberId = await PartNumber.create({
//       partNumber:req.body.partnumber,
//       description:req.body.description,
//       manPower:req.body.manpower,
//       SMH:req.body.smh,
//       rawMaterialId:rawMaterialNameIdValue,
//       kanbanLocation:kanbanLocationId,
//       status:1
//     })
//     .fetch()
//     .catch(error=>{console.log(error)});
//     if(newPartNumberId != null && newPartNumberId != undefined){
//       await PartFile.create({
//         partId:newPartNumberId["id"],
//         fileData:req.body.fileData,
//         fileType:req.body.fileType
//       })
//       .catch(error=>{console.log(error)});
//     }
//     for(var i=0;i<req.body.processes.length;i++){
//       var isGroupName;
//       var j = i+1;
//       // console.log(req.body.processes[i].machines.length)
//       if(req.body.processes[i].machines.length == 0)
//         isGroupName = true;
//       else
//         isGroupName = false;
//       // console.log(isGroupName);
//       var machineGroupId;
//       await MachineGroup.findOne({
//         where:{'name':req.body.processes[i].machineGroupName}
//       })
//       .then((newMachineGroupIdNameValue)=>{machineGroupId = newMachineGroupIdNameValue["id"]})
//       .catch(error=>{console.log("No Group")});
//       // console.log(machineGroupId);
//       var newProcessSequenceId = await ProcessSequence.create({
//         partId:newPartNumberId["id"],
//         sequenceNumber:j,
//         loadingTime: req.body.processes[i].loadingTime,
//         processTime:req.body.processes[i].processTime,
//         unloadingTime:req.body.processes[i].unloadingTime,
//         cycleTime:req.body.processes[i].cycleTime,
//         machineGroupId:machineGroupId,
//         isGroup:isGroupName
//       })
//       .fetch()
//       .catch(error=>{console.log(error)});
//       // console.log(newProcessSequenceId);
//       if(isGroupName == false){
//         console.log(req.body.processes[i].machines.length)
//         for(var machineCount = 0;machineCount<req.body.processes[i].machines.length;machineCount++){
//           console.log(req.body.processes[i].machines[machineCount].machineName);
//           var machineIdValue;
//           await Machine.findOne({
//             where:{'machineName': req.body.processes[i].machines[machineCount].machineName}
//           })
//           .then((newMachineId)=>{machineIdValue = newMachineId["id"]});
//           console.log(machineIdValue)
//           await ProcessSequenceMachineRelation.create({
//             processSequenceId:newProcessSequenceId["id"],
//             machineId:machineIdValue
//           })
//           .catch((error)=>{console.log(error)});
//         }
//       }
//       else{
//         console.log(machineGroupId);
//         var machineGroupMachines = await Machine.find({where:{machineGroupId:machineGroupId}});
//         console.log(machineGroupMachines);
//         for(var machineCount = 0;machineCount<machineGroupMachines.length;machineCount++){
//           var machineIdValue;
//           await Machine.findOne({
//             where:{'machineName': machineGroupMachines[machineCount].machineName}
//           })
//           .then((newMachineId)=>{machineIdValue = newMachineId["id"]});
//           console.log(machineIdValue)
//           await ProcessSequenceMachineRelation.create({
//             processSequenceId:newProcessSequenceId["id"],
//             machineId:machineIdValue
//           })
//           .catch((error)=>{console.log(error)});
//         }
//       }
//     }
//     res.status(200).send(newPartNumberId);
//   },
//   newPart: async function(req,res){
//     var cycleTime = 0;
//     for(var i=0;i<req.body.processes.length;i++){
//       cycleTime = cycleTime + parseInt(req.body.processes[i].loadingTime)+parseInt(req.body.processes[i].processTime)+parseInt(req.body.processes[i].unloadingTime);
//     }
//     var smh = cycleTime/3600;
//     var newPartNumberId = await PartNumber.create({
//       partNumber:req.body.partnumber,
//       description:req.body.description,
//       manPower:req.body.manpower,
//       SMH:smh,
//       rawMaterialId:req.body.rawMaterial.id,
//       status:req.body.status
//     })
//     .fetch()
//     .catch(error=>{console.log(error)});
//     if(newPartNumberId!=null && newPartNumberId!=undefined){
//       await PartFile.create({
//         partId:newPartNumberId["id"],
//         fileData:req.body.fileData,
//         fileType:req.body.fileType
//       })
//       .catch(error=>{console.log(error)});
//       for(var i=0;i<req.body.processes.length;i++){
//         if(req.body.processes[i].machineGroupName!= null && req.body.processes[i].machineGroupName!=undefined&&req.body.processes[i].machineGroupName!=0){
//           var isGroupName;
//           var j = i+1;
//           isGroupName = true;
//           console.log(req.body.processes[i].machineGroupName);
//           var machineGroupId = req.body.processes[i].machineGroupName;
//           var cycleTime = parseInt(req.body.processes[i].loadingTime)+parseInt(req.body.processes[i].processTime)+parseInt(req.body.processes[i].unloadingTime);
//           var newProcessSequenceId = await ProcessSequence.create({
//             partId:newPartNumberId["id"],
//             sequenceNumber:j,
//             loadingTime: req.body.processes[i].loadingTime,
//             processTime:req.body.processes[i].processTime,
//             unloadingTime:req.body.processes[i].unloadingTime,
//             cycleTime:cycleTime,
//             machineGroupId:req.body.processes[i].machineGroupName,
//             isGroup:isGroupName
//           })
//           .fetch()
//           .catch(error=>{console.log(error)});
//           // console.log(newProcessSequenceId);
//           if(newProcessSequenceId!=null&&newProcessSequenceId!=undefined){
//             if(isGroupName == false){
//               // console.log(req.body.processes[i].machines.length)
//               for(var machineCount = 0;machineCount<req.body.processes[i].machines.length;machineCount++){
//                 // console.log(req.body.processes[i].machines[machineCount].machineName);
//                 var machineIdValue;
//                 await Machine.findOne({
//                   where:{'machineName': req.body.processes[i].machines[machineCount].machineName}
//                 })
//                 .then((newMachineId)=>{machineIdValue = newMachineId["id"]});
//                 // console.log(machineIdValue)
//                 await ProcessSequenceMachineRelation.create({
//                   processSequenceId:newProcessSequenceId["id"],
//                   machineId:machineIdValue
//                 })
//                 .catch((error)=>{console.log(error)});
//               }
//             }
//             else{
//               // console.log(machineGroupId);
//               // if(req.body.machineGroupId)
//               var machineGroup = req.body.processes[i].machineGroupName;
//               var machineGroupMachines;
//               console.log(machineGroup);
//               var machineGroupMachine = await Machine.find().populate('machineGroupId',{where:{id:machineGroupId}});
//               console.log(machineGroupMachine);
//               for(var machineCount = 0;machineCount<machineGroupMachine.length;machineCount++){
//                 if(machineGroupMachine[machineCount]["machineGroupId"][0]!=null&&machineGroupMachine[machineCount]["machineGroupId"][0]!=undefined){
//                   await ProcessSequenceMachineRelation.create({
//                     processSequenceId:newProcessSequenceId["id"],
//                     machineId:machineGroupMachine[machineCount]["id"]
//                   });
//                 }
//               }
//               // for(var machineCount = 0;machineCount<machineGroupMachine.length;machineCount++){
//               //   // console.log(machineGroupMachine[machineCount]["machineGroupId"][0]);
//               //   if(machineGroupMachine[machineCount]["machineGroupId"][0]!=null & machineGroupMachine[machineCount]["machineGroupId"][0]!=undefined){
//               //     console.log(machineGroupMachine[machineCount]["machineGroupId"]);
//               //   }
//               // }
//               // for(var j=0;j<machineGroup.length;j++){
//               //   var machineGroupMachine = await Machine.find({where:{machineGroupId:machineGroupId}});
//               //   console.log(machineGroupMachine);
//               //   console.log(machineGroupMachine);
//               //   machineGroupMachines.push(machineGroupMachine);
//               // }
//               // console.log(machineGroupMachines[0]);
//               // var machineGroupMachines = await Machine.find({where:{machineGroupId:machineGroupId[0]}});
//               // console.log(machineGroupMachines);
//               // for(var machineCount = 0;machineCount<machineGroupMachine.length;machineCount++){
//               //   var machineIdValue;
//               //   await Machine.findOne({
//               //     where:{'machineName': machineGroupMachines[machineCount].machineName}
//               //   })
//               //   .then((newMachineId)=>{machineIdValue = newMachineId["id"]});
//               //   // console.log(machineIdValue);
//               //   await ProcessSequenceMachineRelation.create({
//               //     processSequenceId:newProcessSequenceId["id"],
//               //     machineId:machineIdValue
//               //   })
//               //   .catch((error)=>{console.log(error)});
//               // }
//             }
//           }
//         }
//       }
//     }
//     res.status(200).send(newPartNumberId);
//   }
// };
