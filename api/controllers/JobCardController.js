/**
 * JobCardController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function(req,res){

    var globalDate = sails.config.myglobal.dateTimeGlobal;
    var d = new Date();
    // //console.log(d);
    var curr_time = d.getTime();
    // //console.log(curr_time);
    var barcodeSerial = "JO";
    var serialNumber;

    if(globalDate == curr_time){
      // console.log("Same DateTime",globalDate,curr_time);
      // var getJobCard = await JobCard.find()
      // .sort('id DESC')
      // .limit(1);
      // if(getJobCard[0] != null && getJobCard[0] != undefined){
      //   var BarcodeDay = getJobCard[0]["barcodeSerial"];
      //   var lastBarcodeMintues = BarcodeDay.substring(2,15);
      //   console.log("Found Job Card",lastBarcodeMintues);
      //   if(curr_time == lastBarcodeMintues){
      //     var lastSerialNumber = getJobCard[0]["barcodeSerial"];
      //     lastSerialNumber = lastSerialNumber.substring(15,18);
      //     console.log("Same Time",lastSerialNumber);
      //     serialNumber = parseInt(lastSerialNumber) + 1;
      //     if(serialNumber.toString().length == 1){
      //       serialNumber = "00" + serialNumber
      //     }
      //     else if(serialNumber.toString().length == 2){
      //       serialNumber = "0" + serialNumber
      //     }
      //   }
      //   else{
      //     serialNumber = "001";
      //   }
      // }
      // else{
      //   serialNumber = "001";
      // }
      serialNumber = parseInt(sails.config.myglobal.counter) + 1;
      sails.config.myglobal.counter = sails.config.myglobal.counter +1;
      if(serialNumber.toString().length == 1){
        serialNumber = "00" + serialNumber
      }
      else if(serialNumber.toString().length == 2){
        serialNumber = "0" + serialNumber
      }
    }
    else{
      sails.config.myglobal.dateTimeGlobal = curr_time;
      sails.config.myglobal.counter = 1;
      serialNumber = "001";
    }

    barcodeSerial = barcodeSerial + curr_time + serialNumber;

    var partNumber = await PartNumber.find({
      id:req.body.partNumber
    });
    var SMH = partNumber[0]["SMH"];
    SMH = SMH * req.body.requestedQuantity;
    var shiftTime = await Shift.find({
      name:req.body.shiftName,
      cell:req.body.cell
    });
    shiftTime = shiftTime[0];

    //console.log(shiftTime);
    var millis = new Date();
    var hrs = millis.getHours();
    hrs = hrs * 3600;
    var min = millis.getMinutes();
    min = min * 60;
    var sec = millis.getSeconds();
    var timestamp = hrs+min+sec;

    //console.log(timestamp,"timestamp");
    var estimatedDate = timestamp + SMH;
    if(timestamp<shiftTime["teaBreakStartInSeconds"]){
      if(estimatedDate > shiftTime["teaBreakStartInSeconds"]){
        estimatedDate = estimatedDate + 600;
        //console.log("tea");
      }
    }
    if(timestamp<shiftTime["lunchBreakStartInSeconds"]){
      if(estimatedDate > shiftTime["lunchBreakStartInSeconds"]){
        estimatedDate = estimatedDate + 1800;
        //console.log("Lunch")
      }
    }

    // //console.log(estimatedDate,timestamp);
    estimatedDate = estimatedDate - timestamp;
    var dt = new Date();
    dt.setSeconds( dt.getSeconds() + estimatedDate );
    estimatedDate = dt.toString();
    estimatedDate = estimatedDate.substr(0,24);

    var newJobCard = await JobCard.create({
      productionSchedulePartRelationId:req.body.productionSchedulePartRelationId,
      requestedQuantity:req.body.requestedQuantity,
      actualQuantity:req.body.actualQuantity,
      status:req.body.status,
      estimatedDate:estimatedDate,
      barcodeSerial:barcodeSerial,
      currentLocation:req.body.currentLocation,
      jobcardStatus:req.body.jobcardStatus
    })
    .fetch()
    .catch((error)=>{console.log(error)});
    // var machineGroupNew = await Machine.find()
   //  .populate('machineGroupId');
   //  var suggestedLocations = "";
   //  for(var i=0;i<machineGroupNew.length;i++){
   //    //console.log(machineGroupNew[i]["machineGroupId"][0]);
   //    if(req.body.suggestedDropLocations == machineGroupNew[i]["machineGroupId"][0]["id"]){
   //      suggestedLocations = suggestedLocations + "," + machineGroupNew[i]["machineName"];
   //    }
   //  }

    var machineGroups = await MachineGroup.find({
      id:req.body.suggestedDropLocations
    })
    .populate("machines");
    // //console.log("Line 200",machineGroups[0]);
    var suggestedLocations="";
    for(var i=0;i<machineGroups[0]["machines"].length;i++){
      suggestedLocations = suggestedLocations + "," + machineGroups[0]["machines"][i]["machineName"];
    }
    // //console.log(suggestedLocations)
    // //console.log(machineGroupNew[0]["machineGroupId"][0]["id"]);
    await Joblocationrelation.create({
       jobcardId:newJobCard["id"],
       jobProcessSequenceRelationId:0,
       sourceLocation:1,
       destinationLocationId:req.body.destinationLocationId,
       suggestedDropLocations:suggestedLocations,
       processStatus:"Pending"
     })
    .catch((error)=>{console.log(error)});
    res.status(200).send(newJobCard);
  },

  getDetailJobCard : async function(req,res){
    var processSequence1;
    var processSequence2;
    var processSequence3;
    var processSequence4;
    var processSequence5;
    var jobcard = await JobCard.find({
      barcodeSerial : req.body.barcodeSerial
    });
    //console.log(jobcard);
    if(jobcard!=null&&jobcard!=undefined){
      var productionSchedulePartRelation = await ProductionSchedulePartRelation.find({
        id:jobcard[0]["productionSchedulePartRelationId"]
      });
      //console.log(productionSchedulePartRelation);
      if(productionSchedulePartRelation!=null&&productionSchedulePartRelation!=undefined){
        var processSequence = await ProcessSequence.find({
          partId:productionSchedulePartRelation[0]["partNumberId"],
          status :1
        });
        //console.log("Line 170",processSequence.length);
        if(processSequence[0] != null && processSequence[0] != undefined){
          //console.log(processSequence[0]["machineGroupId"]);
          if(processSequence.length == 1){
            var machineGroup = await MachineGroup.find({
              id:processSequence[0]["machineGroupId"]
            });
            //console.log("Line 176",machineGroup);
            // processSequence1 = machineGroup[0]["machineTypeId"];
            if(machineGroup!=null&&machineGroup!=undefined){
              var machineType = await MachineType.find({
                id:machineGroup[0]["machineTypeId"]
              });
              //console.log("Line 182",machineType);
              processSequence1 = machineType[0]["name"];
            }
          }
          else if(processSequence.length == 2){
            var machineGroup = await MachineGroup.find({
              id:processSequence[0]["machineGroupId"]
            });
            //console.log("Line 190",machineGroup);
            // processSequence1 = machineGroup[0]["machineTypeId"];
            if(machineGroup!=null&&machineGroup!=undefined){
              var machineType = await MachineType.find({
                id:machineGroup[0]["machineTypeId"]
              });
              processSequence1 = machineType[0]["name"];
            }
            //console.log("line 198", processSequence1);
            var machineGroup = await MachineGroup.find({
              id:processSequence[1]["machineGroupId"]
            });
            // processSequence1 = machineGroup[0]["machineTypeId"];
            if(machineGroup!=null&&machineGroup!=undefined){
              var machineType = await MachineType.find({
                id:machineGroup[0]["machineTypeId"]
              });
              processSequence2 = machineType[0]["name"];
            }
          }
          else if(processSequence.length == 3){
            var machineGroup = await MachineGroup.find({
              id:processSequence[0]["machineGroupId"]
            });
            // processSequence1 = machineGroup[0]["machineTypeId"];
            if(machineGroup!=null&&machineGroup!=undefined){
              var machineType = await MachineType.find({
                id:machineGroup[0]["machineTypeId"]
              });
              processSequence1 = machineType[0]["name"];
            }
            var machineGroup = await MachineGroup.find({
              id:processSequence[1]["machineGroupId"]
            });
            // processSequence1 = machineGroup[0]["machineTypeId"];
            if(machineGroup!=null&&machineGroup!=undefined){
              var machineType = await MachineType.find({
                id:machineGroup[0]["machineTypeId"]
              });
              processSequence2 = machineType[0]["name"];
            }
            var machineGroup = await MachineGroup.find({
              id:processSequence[2]["machineGroupId"]
            });
            // processSequence1 = machineGroup[0]["machineTypeId"];
            if(machineGroup!=null&&machineGroup!=undefined){
              var machineType = await MachineType.find({
                id:machineGroup[0]["machineTypeId"]
              });
              processSequence3 = machineType[0]["name"];
            }
          }
          else if(processSequence.length == 4){
            var machineGroup = await MachineGroup.find({
              id:processSequence[0]["machineGroupId"]
            });
            // processSequence1 = machineGroup[0]["machineTypeId"];
            if(machineGroup!=null&&machineGroup!=undefined){
              var machineType = await MachineType.find({
                id:machineGroup[0]["machineTypeId"]
              });
              processSequence1 = machineType[0]["name"];
            }
            var machineGroup = await MachineGroup.find({
              id:processSequence[1]["machineGroupId"]
            });
            // processSequence1 = machineGroup[0]["machineTypeId"];
            if(machineGroup!=null&&machineGroup!=undefined){
              var machineType = await MachineType.find({
                id:machineGroup[0]["machineTypeId"]
              });
              processSequence2 = machineType[0]["name"];
            }
            var machineGroup = await MachineGroup.find({
              id:processSequence[2]["machineGroupId"]
            });
            // processSequence1 = machineGroup[0]["machineTypeId"];
            if(machineGroup!=null&&machineGroup!=undefined){
              var machineType = await MachineType.find({
                id:machineGroup[0]["machineTypeId"]
              });
              processSequence3 = machineType[0]["name"];
            }
            var machineGroup = await MachineGroup.find({
              id:processSequence[3]["machineGroupId"]
            });
            // processSequence1 = machineGroup[0]["machineTypeId"];
            if(machineGroup!=null&&machineGroup!=undefined){
              var machineType = await MachineType.find({
                id:machineGroup[0]["machineTypeId"]
              });
              processSequence4 = machineType[0]["name"];
            }
          }
          else if(processSequence.length == 5){
            var machineGroup = await MachineGroup.find({
              id:processSequence[0]["machineGroupId"]
            });
            // processSequence1 = machineGroup[0]["machineTypeId"];
            if(machineGroup!=null&&machineGroup!=undefined){
              var machineType = await MachineType.find({
                id:machineGroup[0]["machineTypeId"]
              });
              processSequence1 = machineType[0]["name"];
            }
            var machineGroup = await MachineGroup.find({
              id:processSequence[1]["machineGroupId"]
            });
            // processSequence1 = machineGroup[0]["machineTypeId"];
            if(machineGroup!=null&&machineGroup!=undefined){
              var machineType = await MachineType.find({
                id:machineGroup[0]["machineTypeId"]
              });
              processSequence2 = machineType[0]["name"];
            }
            var machineGroup = await MachineGroup.find({
              id:processSequence[2]["machineGroupId"]
            });
            // processSequence1 = machineGroup[0]["machineTypeId"];
            if(machineGroup!=null&&machineGroup!=undefined){
              var machineType = await MachineType.find({
                id:machineGroup[0]["machineTypeId"]
              });
              processSequence3 = machineType[0]["name"];
            }
            var machineGroup = await MachineGroup.find({
              id:processSequence[3]["machineGroupId"]
            });
            // processSequence1 = machineGroup[0]["machineTypeId"];
            if(machineGroup!=null&&machineGroup!=undefined){
              var machineType = await MachineType.find({
                id:machineGroup[0]["machineTypeId"]
              });
              processSequence4 = machineType[0]["name"];
            }
            var machineGroup = await MachineGroup.find({
              id:processSequence[4]["machineGroupId"]
            });
            // processSequence1 = machineGroup[0]["machineTypeId"];
            if(machineGroup!=null&&machineGroup!=undefined){
              var machineType = await MachineType.find({
                id:machineGroup[0]["machineTypeId"]
              });
              processSequence5 = machineType[0]["name"];
            }
          }
        }
      }
    }
    var processes = {
      processSequence1:processSequence1,
      processSequence2:processSequence2,
      processSequence3:processSequence3,
      processSequence4:processSequence4,
      processSequence5:processSequence5,
    }
    //console.log(processes);
    res.send(processes);
  },

  completeJobCard: async function(req,res){
    await JobCard.update({
      id:req.body.jobcardId
    })
    .set({
      actualQuantity:req.body.quantity,
      jobcardStatus:"Completed",
      updatedBy:req.body.userId
    });
    await Joblocationrelation.create({
        jobcardId:req.body.jobcardId,
        jobProcessSequenceRelationId:0,
        sourceLocation:0,
        suggestedDropLocations:"Store",
        processStatus:"Pending"
      });
    await JobProcessSequenceRelation.update({
      jobId:req.body.jobcardId
    })
    .set({
      processStatus:"FinalComplete"
    });
    var dateTime = new Date();
    var jobProcessSequenceRelation =await JobProcessSequenceRelation.find({
      jobId:req.body.jobcardId
    });
    var processSequence = await ProcessSequence.find({
      id:jobProcessSequenceRelation[0]["processSequenceId"],
      status:1
    });
    var partNumber = await PartNumber.find({
      id:processSequence[0]["partId"]
    });
    await SapTransaction.create({
      plant:"Tata Marcopolo Dharwad",
      date:dateTime,
      material:partNumber[0]["partNumber"],
      jobCard:jobCardBarcode[0]["barcodeSerial"],
      uniqueNumber:dateTime,
      quantity:req.body.quantity,
      documentNumber:0
    });
  },

  getJobcardCount:async function(req,res){
    var responseArray = [];
    //console.log("line 319",req.query.scheduleId);
    var newGetProductionScheduleId = await ProductionSchedulePartRelation.find({
      scheduleId: req.query.scheduleId
    }).populate('jobcard');
    //console.log("newGetProductionScheduleId",newGetProductionScheduleId);
    if(newGetProductionScheduleId[0] != null && newGetProductionScheduleId[0] != undefined){
      //console.log("Total Job Card", newGetProductionScheduleId.length);
      var totalJobCards = newGetProductionScheduleId.length;
      var inProgressRequestQuantity = 0;
      var pendingRequestQuantity = 0;
      var completedRequestQuantity = 0;
      var newRequestQuantity = 0;
      var inProgressActualQuantity = 0;
      var pendingActualQuantity = 0;
      var completedActualQuantity = 0;
      var newActualQuantity = 0;
      var inProgressJobCardQuantity = 0;
      var pendingJobCardQuantity = 0;
      var completedJobCardQuantity = 0;
      var newJobCardQuantity = 0;
      //console.log(newGetProductionScheduleId[0]["jobcard"].length);
      for(var j=0; j<newGetProductionScheduleId.length; j++){
      for(var i=0; i<newGetProductionScheduleId[j]["jobcard"].length; i++){
        // //console.log(newGetProductionScheduleId[0]["jobcard"][i]["jobcardStatus"]);
          if(newGetProductionScheduleId[j]["jobcard"][i]["jobcardStatus"] == "In Progress"){
            inProgressRequestQuantity = inProgressRequestQuantity + newGetProductionScheduleId[j]["jobcard"][i]["requestedQuantity"];
            inProgressActualQuantity = inProgressActualQuantity + newGetProductionScheduleId[j]["jobcard"][i]["actualQuantity"];
            inProgressJobCardQuantity++;
          }
          else if(newGetProductionScheduleId[j]["jobcard"][i]["jobcardStatus"] == "Pending"){
            pendingRequestQuantity = pendingRequestQuantity + newGetProductionScheduleId[j]["jobcard"][i]["requestedQuantity"];
            pendingActualQuantity = pendingActualQuantity + newGetProductionScheduleId[j]["jobcard"][i]["actualQuantity"];
            pendingJobCardQuantity++;
          }
          else if(newGetProductionScheduleId[j]["jobcard"][i]["jobcardStatus"] == "Completed"){
            completedRequestQuantity = completedRequestQuantity + newGetProductionScheduleId[j]["jobcard"][i]["requestedQuantity"];
            completedActualQuantity = completedActualQuantity + newGetProductionScheduleId[j]["jobcard"][i]["actualQuantity"];
            completedJobCardQuantity++;
          }
          else{
            newRequestQuantity = newRequestQuantity + newGetProductionScheduleId[j]["jobcard"][i]["requestedQuantity"];
            newActualQuantity = newActualQuantity + newGetProductionScheduleId[j]["jobcard"][i]["actualQuantity"];
            newJobCardQuantity++;

          }
        }
      }
      //console.log("inProgressRequestQuantity",inProgressRequestQuantity);
      //console.log("pendingRequestQuantity",pendingRequestQuantity);
      //console.log("completedRequestQuantity",completedRequestQuantity);
      //console.log("newRequestQuantity",newRequestQuantity);
      //console.log("inProgressActualQuantity",inProgressActualQuantity);
      //console.log("pendingActualQuantity",pendingActualQuantity);
      //console.log("completedActualQuantity",completedActualQuantity);
      //console.log("newActualQuantity",newActualQuantity);
      //console.log("inProgressJobCardQuantity",inProgressJobCardQuantity);
      //console.log("pendingJobCardQuantity",pendingJobCardQuantity);
      //console.log("completedJobCardQuantity",completedJobCardQuantity);
      //console.log("newJobCardQuantity",newJobCardQuantity);

      var requestedData = {
        inProgressRequestQuantity:inProgressRequestQuantity,
        pendingRequestQuantity:pendingRequestQuantity,
        completedRequestQuantity:completedRequestQuantity,
        newRequestQuantity:newRequestQuantity,
        inProgressActualQuantity:inProgressActualQuantity,
        pendingActualQuantity:pendingActualQuantity,
        completedActualQuantity:completedActualQuantity,
        newActualQuantity:newActualQuantity,
        inProgressJobCardQuantity:inProgressJobCardQuantity,
        pendingJobCardQuantity:pendingJobCardQuantity,
        completedJobCardQuantity:completedJobCardQuantity,
        newJobCardQuantity:newJobCardQuantity
      }
      responseArray.push(requestedData);
    }
    res.send(responseArray);
  },

  getJobCardByPartNumber:async function(req,res){
    var jobCardData=[];
    var newGetProductionScheduleId = await ProductionSchedulePartRelation.find({
      partNumberId: req.query.partId
    }).populate('jobcard')
    .populate('partNumberId');
    if(newGetProductionScheduleId[0] != null && newGetProductionScheduleId[0] != undefined){
      // //console.log(newGetProductionScheduleId.length);
      // for(var i=0; i<newGetProductionScheduleId.length; i++){
      //   if(newGetProductionScheduleId[i]["jobcard"][0] != null && newGetProductionScheduleId[i]["jobcard"][0] != undefined)
      //   jobCardData.push(newGetProductionScheduleId[i]["jobcard"]);
      // }
    }
    res.send(newGetProductionScheduleId);
  },
  getCell:async function(req,res){
      //console.log(req.query["parNumbertId"]);
      var getProcessSequence = await ProcessSequence.find({
        sequenceNumber:1,
        partId:req.query["parNumbertId"],
        status:1
      });
      if(getProcessSequence[0] != null && getProcessSequence[0] != undefined){
        var getMachineGroupId = await MachineGroup.find({
          id:getProcessSequence[0]["machineGroupId"]
        })
        .populate("machines");
        //console.log(getMachineGroupId[0]["machines"][0]["cellId"]);
        if(getMachineGroupId[0] != null && getMachineGroupId[0] != undefined && getMachineGroupId[0]["machines"][0] != null && getMachineGroupId[0]["machines"][0] != undefined){
          var getCellName = await Cell.find({
            id:getMachineGroupId[0]["machines"][0]["cellId"]
          });
          //console.log(getCellName[0]["name"]);
          var sendCell = {
            cellName: getCellName[0]["name"]
          }
          res.send(sendCell);
        }
        else{
          res.send("Exit");
        }
      }
      else{
        res.send("Exit");
      }
    }
  };
