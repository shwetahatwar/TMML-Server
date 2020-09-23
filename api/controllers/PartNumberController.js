/**
 * PartnumberController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var nodemailer = require ('nodemailer');
var json2xls = require('json2xls');
var fs = require('fs');
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
      rackLoc:req.body.rackLoc,
      prodLoc:req.body.prodLoc,
      status:1,
      jcCreateStatus:1
    })
    .fetch()
    .catch(error=>{
      sails.log.error("Part Number not added in software"+req.body.partnumber+"",newPartNumberId);
      console.log(error)});
    if(newPartNumberId != null && newPartNumberId != undefined){
      await PartFile.create({
        partId:newPartNumberId["id"],
        fileData:req.body.fileData,
        fileType:req.body.fileType
      })
      .catch(error=>{
        sails.log.error("Part Number file not uploaded in software"+req.body.partnumber+"");
        console.log(error)});
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

  getPartSMHZero : async function(req,res){
    var getCount = [];
    var newCount = await PartNumber.count({
      SMH:0,
      status:1
    });
    // console.log("Line 113", getCount);
    // res.status(200);
    getCount.push(newCount);
    res.send(getCount);
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
      rackLoc:req.body.rackLoc,
      prodLoc:req.body.prodLoc,
      status:req.body.status,
      jcCreateStatus:1
    })
    .fetch()
    .catch(error=>{
      sails.log.error("Part Numbers not added in software"+req.body.partnumber+"",newPartNumberId);
      console.log(error)});
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
          .catch(error=>{
            sails.log.error("error while uploading process sequence for new part",error);
            console.log(error)});
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
                  sails.log.error(error);
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
                var getLocation = await Location.find({
                  locationType:"Kanban Location"
                })
                .sort('id DESC')
                .limit(1);
                var barcodeSerial = "LK";
                if(getLocation[0] != null && getLocation[0] != undefined){
                  var lastSerialNumber = getLocation[0]["barcodeSerial"];
                  lastSerialNumber = lastSerialNumber.substring(2,5);
                  console.log(lastSerialNumber);
                  var serialNumber = parseInt(lastSerialNumber) + 1;
                  if(serialNumber.toString().length == 1){
                    serialNumber = "00" + serialNumber
                  }
                  else if(serialNumber.toString().length == 2){
                    serialNumber = "0" + serialNumber
                  }
                  barcodeSerial = barcodeSerial + serialNumber;
                }
                else{
                  barcodeSerial = barcodeSerial + "001"
                }
                kanbanLocationId = await Location.create({
                  name:partNumberBulkUpload[i].SAPLocation,
                  barcodeSerial:barcodeSerial,
                  locationType:"Kanban Location"
                })
                .fetch();
              }
              await PartNumber.create({
                partNumber: partNumberBulkUpload[i].partNumber,
                description: partNumberBulkUpload[i].partDescription,
                rawMaterialId: rawMaterial[0]["id"],
                status: 1,
                rackLoc:partNumberBulkUpload[i].rackLoc,
                prodLoc:partNumberBulkUpload[i].prodLoc,
                materialGroup: partNumberBulkUpload[i].MaterialGroup,
                kanbanLocation: kanbanLocationId["id"],
                uom:partNumberBulkUpload[i].UOM,
                jcCreateStatus:1
              });
          }
          else{
            var newRawMaterial = await RawMaterial.create({
              rawMaterialNumber: partNumberBulkUpload[i].rawMaterialNumber,
              description: "",
              uom: partNumberBulkUpload[i].rmUOM,
              remarks: "",
              status:1,
              materialTypeId:2
            })
            .fetch();
            var kanbanLocationId;
            var kanbanLocation = await Location.find({
              name: partNumberBulkUpload[i].SAPLocation
            });
            if(kanbanLocation[0] != null && kanbanLocation[0] != undefined){
              kanbanLocationId = kanbanLocation[0]["id"]
            }
            else{
              var getLocation = await Location.find({
                locationType:"Kanban Location"
              })
              .sort('id DESC')
              .limit(1);
              var barcodeSerial = "LK";
              if(getLocation[0] != null && getLocation[0] != undefined){
                var lastSerialNumber = getLocation[0]["barcodeSerial"];
                lastSerialNumber = lastSerialNumber.substring(2,5);
                console.log(lastSerialNumber);
                var serialNumber = parseInt(lastSerialNumber) + 1;
                if(serialNumber.toString().length == 1){
                  serialNumber = "00" + serialNumber
                }
                else if(serialNumber.toString().length == 2){
                  serialNumber = "0" + serialNumber
                }
                barcodeSerial = barcodeSerial + serialNumber;
              }
              else{
                barcodeSerial = barcodeSerial + "001"
              }
              kanbanLocationId = await Location.create({
                name:partNumberBulkUpload[i].SAPLocation,
                barcodeSerial:barcodeSerial,
                locationType:"Kanban Location"
              })
              .fetch();
            }
            console.log("Line 398", newRawMaterial);
            await PartNumber.create({
              partNumber: partNumberBulkUpload[i].partNumber,
              description: partNumberBulkUpload[i].partDescription,
              rawMaterialId: newRawMaterial["id"],
              status: 1,
              rackLoc:partNumberBulkUpload[i].rackLoc,
              prodLoc:partNumberBulkUpload[i].prodLoc,
              materialGroup: partNumberBulkUpload[i].MaterialGroup,
              kanbanLocation: kanbanLocationId["id"],
              uom:partNumberBulkUpload[i].UOM,
              jcCreateStatus:1
            });
          }
        }
      }
    }
    res.send();
  },

  dailyUpdatedParts :async function(req,res){
    var selfSignedConfig = {
      host: '128.9.24.24',
      port: 25
    };
    var transporter = nodemailer.createTransport(selfSignedConfig);
    var d = new Date();
    var startTime =  (parseInt(d.getMonth()) + 1) +"-"+ (parseInt(d.getDate()) - 1) +"-"+ d.getFullYear()+ " " +"00:00:01";
    var dt = new Date(startTime);
    updatedAtStart=dt.setSeconds( dt.getSeconds());
    var EndTime =  (parseInt(d.getMonth()) + 1) +"-"+ (parseInt(d.getDate()) - 1) +"-"+ d.getFullYear()+ " " +"23:59:00";
    dt = new Date(EndTime);
    updatedAtEnd=dt.setSeconds( dt.getSeconds());
    console.log(startTime,EndTime);
    console.log("TimeStamps: ",updatedAtStart,updatedAtEnd);

    var parts = await PartNumber.find({
      where: {
        updatedAt :{ '>=':updatedAtStart,'<=':updatedAtEnd}
      }}).populate('rawMaterialId')
    .populate('kanbanLocation')
    console.log("parts",parts)
    var partNumberDataList = [];
    if(parts.length!=0){
      for(var i=0;i<parts.length;i++){
        var kanbanLocation = "";
        var rawMaterialNumber = "";
        var rawMaterialDesc="";
        if(parts[i]["rawMaterialId"]){
          rawMaterialNumber = parts[i]["rawMaterialId"]["rawMaterialNumber"];
          rawMaterialDesc = parts[i]["rawMaterialId"]["description"];
        }
        if(parts[i]["kanbanLocation"]){
          kanbanLocation = parts[i]["kanbanLocation"]["name"];        
        }
        var partNumberData = {
          'Part Number': parts[i]["partNumber"],
          'Description' : parts[i]["description"],
          'Rack Location' : parts[i]["rackLoc"],
          'Production Location': parts[i]["prodLoc"],
          'Part Status': parts[i]["partStatus"],
          'Raw Material Number':rawMaterialNumber,
          'Raw Material Description':rawMaterialDesc,
          'SAP Location':kanbanLocation
          }
        partNumberDataList.push(partNumberData);
      }
      console.log(partNumberDataList);
      var xls1 = json2xls(partNumberDataList);
      var curr_date = d.getDate();
      if(curr_date.toString().length == 1){
        curr_date = "0" + curr_date
      }
      var curr_month = parseInt(d.getMonth()) + 1;
      curr_month = ""+curr_month;
      if(curr_month.toString().length == 1){
        curr_month = "0" + curr_month
      }
      var curr_year = d.getFullYear();
      curr_year = curr_year.toString();
      curr_year = curr_year.substring(2,4);
      dateTimeFormat = curr_date + "-" + curr_month + "-" + curr_year;
      console.log("dateTimeFormat",dateTimeFormat)
      var filename1 = 'D:/TMML/BRiOT-TMML-Machine-Shop-Solution/server/Reports/PartNumber-Data/Parts-Updated '+dateTimeFormat+'.xlsx';
      fs.writeFileSync(filename1, xls1, 'binary',function(err) {
        if (err) {
          console.log('Some error occured - file either not saved or corrupted file saved.');
          sails.log.error("Some error occured - file either not saved or corrupted file saved.");
        } else {
          console.log('It\'s saved!');
        }
      });
      var mailText = "Please find parts updated by SAP from "+startTime+" to "+EndTime+" in attached file.";
      console.log(mailText);
      var mailOptions = {
        from: "MachineShop_WIP@tatamarcopolo.com", // sender address (who sends)
        to:"santosh.adaki@tatamarcopolo.com;divyah.ttl@tatamotors.com;nikhil.kamble@briot.in;sagar@briot.in",
        subject: "Part Number list updated by SAP", // Subject line
        text: mailText,
        attachments :[
        {
          'filename':'Parts-Updated '+dateTimeFormat+'.xlsx',
          'path': filename1
        }
        ],
      };
      transporter.sendMail(mailOptions, function(error, info) {
        if(error){
          sails.log.error("parts report mail not sent",error);
        } else {
          sails.log.info('parts Message sent: ' + info.response);
        }
      });
    }
  }
};
