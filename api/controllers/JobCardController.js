/**
 * JobCardController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function(req,res){

    var getJobCard = await JobCard.find()
    .sort('id DESC')
    .limit(1);

    var d = new Date();
    console.log(d);
    // var curr_date = d.getDate();
    // if(curr_date.toString().length == 1){
    //   curr_date = "0" + curr_date
    // }
    // var curr_month = parseInt(d.getMonth()) + 1;
    // curr_month = ""+curr_month;
    // if(curr_month.toString().length == 1){
    //   curr_month = "0" + curr_month
    // }
    // var curr_year = d.getFullYear();
    // console.log(curr_year);
    var curr_time = d.getTime();
    console.log(curr_time);
    var barcodeSerial = "JO";
    var serialNumber;
    if(getJobCard[0]!=null && getJobCard[0]!=undefined){
      var BarcodeDay = getJobCard[0]["barcodeSerial"];
      // lastBarcodeDay = BarcodeDay.substring(8,10);
      // console.log(lastBarcodeDay);
      var lastBarcodeMintues = BarcodeDay.substring(2,15);
      console.log("Line 35",lastBarcodeMintues);
      // if(lastBarcodeDay == curr_date){
        if(curr_time == lastBarcodeMintues){
          var lastSerialNumber = getJobCard[0]["barcodeSerial"];
          lastSerialNumber = lastSerialNumber.substring(15,18);
          console.log(lastSerialNumber);
          serialNumber = parseInt(lastSerialNumber) + 1;
          if(serialNumber.toString().length == 1){
            serialNumber = "00" + serialNumber
          }
          else if(serialNumber.toString().length == 2){
            serialNumber = "0" + serialNumber
          }
        }
        else{
          serialNumber = "001";
        }
      // }
      // else{
      //   serialNumber = "001";
      // }
    }
    else{
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

    console.log(shiftTime);
    var millis = new Date();
    var hrs = millis.getHours();
    hrs = hrs * 3600;
    var min = millis.getMinutes();
    min = min * 60;
    var sec = millis.getSeconds();
    var timestamp = hrs+min+sec;

    console.log(timestamp,"timestamp");
    var estimatedDate = timestamp + SMH;
    if(timestamp<shiftTime["teaBreakStartInSeconds"]){
      if(estimatedDate > shiftTime["teaBreakStartInSeconds"]){
        estimatedDate = estimatedDate + 600;
        console.log("tea");
      }
    }
    if(timestamp<shiftTime["lunchBreakStartInSeconds"]){
      if(estimatedDate > shiftTime["lunchBreakStartInSeconds"]){
        estimatedDate = estimatedDate + 1800;
        console.log("Lunch")
      }
    }

    console.log(estimatedDate,timestamp);
    estimatedDate = estimatedDate - timestamp;
    var dt = new Date();
    dt.setSeconds( dt.getSeconds() + estimatedDate );
    estimatedDate = dt.toString();
    estimatedDate = estimatedDate.substr(0,24);
    // var curr_date = dt.getDate();
    // if(curr_date.toString().length == 1){
    //   curr_date = "0" + curr_date
    // }
    // var curr_month = parseInt(dt.getMonth()) + 1;
    // curr_month = ""+curr_month;
    // if(curr_month.toString().length == 1){
    //   curr_month = "0" + curr_month
    // }
    // var curr_year = dt.getFullYear();
    // // console.log(curr_year);
    // var hours = dt.getHours();
    // var minutes = dt.getMinutes();
    // var ampm = hours >= 12 ? 'pm' : 'am';
    // hours = hours % 12;
    // hours = hours ? hours : 12; // the hour '0' should be '12'
    // minutes = minutes < 10 ? '0'+minutes : minutes;
    // var strTime = hours + ':' + minutes + ' ' + ampm;
    // //return strTime;
    //
    // estimatedDate = curr_date + "-" + curr_month + "-" + curr_year + " " + strTime;
    console.log(estimatedDate);

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
   //    console.log(machineGroupNew[i]["machineGroupId"][0]);
   //    if(req.body.suggestedDropLocations == machineGroupNew[i]["machineGroupId"][0]["id"]){
   //      suggestedLocations = suggestedLocations + "," + machineGroupNew[i]["machineName"];
   //    }
   //  }

    var machineGroups = await MachineGroup.find({
      id:req.body.suggestedDropLocations
    })
    .populate("machines");
    console.log("Line 200",machineGroups[0]);
    var suggestedLocations="";
    for(var i=0;i<machineGroups[0]["machines"].length;i++){
      suggestedLocations = suggestedLocations + "," + machineGroups[0]["machines"][i]["machineName"];
    }
    console.log(suggestedLocations)
    // console.log(machineGroupNew[0]["machineGroupId"][0]["id"]);
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
    var jobcard = await JobCard.find({
      barcodeSerial : req.body.barcodeSerial
    });
    console.log(jobcard);
    if(jobcard!=null&&jobcard!=undefined){
      var productionSchedulePartRelation = await ProductionSchedulePartRelation.find({
        id:jobcard[0]["productionSchedulePartRelationId"]
      });
      console.log(productionSchedulePartRelation);
      if(productionSchedulePartRelation!=null&&productionSchedulePartRelation!=undefined){
        var processSequence = await ProcessSequence.find({
          partId:productionSchedulePartRelation[0]["partNumberId"]
        });
        console.log("Line 170",processSequence);
        if(processSequence!=null&&processSequence!=undefined){
          if(processSequence.length == 1){
            var machineGroup = await MachineGroup.find({
              id:processSequence[0]["machineGroupId"]
            });
            console.log("Line 176",machineGroup);
            // processSequence1 = machineGroup[0]["machineTypeId"];
            if(machineGroup!=null&&machineGroup!=undefined){
              var machineType = await MachineType.find({
                id:machineGroup[0]["machineTypeId"]
              });
              console.log("Line 182",machineType);
              processSequence1 = machineType[0]["name"];
            }
          }
          else if(processSequence.length == 2){
            var machineGroup = await MachineGroup.find({
              id:processSequence[0]["machineGroupId"]
            });
            console.log("Line 190",machineGroup);
            // processSequence1 = machineGroup[0]["machineTypeId"];
            if(machineGroup!=null&&machineGroup!=undefined){
              var machineType = await MachineType.find({
                id:machineGroup[0]["machineTypeId"]
              });
              processSequence1 = machineType[0]["name"];
            }
            console.log("line 198", processSequence1);
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
        }
      }
    }
    var processes = {
      processSequence1:processSequence1,
      processSequence2:processSequence2,
      processSequence3:processSequence3
    }
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
    var jobProcessSequenceRelation = JobProcessSequenceRelation.find({
      jobId:req.body.jobcardId
    });
    var processSequence = ProcessSequence.find({
      id:jobProcessSequenceRelation[0]["processSequenceId"]
    });
    var partNumber = PartNumber.find({
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
    console.log("line 319",req.query.scheduleId);
    var newGetProductionScheduleId = await ProductionSchedulePartRelation.find({
      scheduleId: req.query.scheduleId
    }).populate('jobcard');
    if(newGetProductionScheduleId[0] != null && newGetProductionScheduleId[0] != undefined){
      console.log("Total Job Card", newGetProductionScheduleId[0]["jobcard"].length);
      var totalJobCards = newGetProductionScheduleId[0]["jobcard"].length;
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

      for(var i=0; i<newGetProductionScheduleId[0]["jobcard"].length; i++){
        // console.log(newGetProductionScheduleId[0]["jobcard"][i]["jobcardStatus"]);
        if(newGetProductionScheduleId[0]["jobcard"][i]["jobcardStatus"] == "In Progress"){
          inProgressRequestQuantity = inProgressRequestQuantity + newGetProductionScheduleId[0]["jobcard"][i]["requestedQuantity"];
          inProgressActualQuantity = inProgressActualQuantity + newGetProductionScheduleId[0]["jobcard"][i]["actualQuantity"];
          inProgressJobCardQuantity++;
        }
        else if(newGetProductionScheduleId[0]["jobcard"][i]["jobcardStatus"] == "Pending"){
          pendingRequestQuantity = pendingRequestQuantity + newGetProductionScheduleId[0]["jobcard"][i]["requestedQuantity"];
          pendingActualQuantity = pendingActualQuantity + newGetProductionScheduleId[0]["jobcard"][i]["actualQuantity"];
          pendingJobCardQuantity++;
        }
        else if(newGetProductionScheduleId[0]["jobcard"][i]["jobcardStatus"] == "Completed"){
          completedRequestQuantity = completedRequestQuantity + newGetProductionScheduleId[0]["jobcard"][i]["requestedQuantity"];
          completedActualQuantity = completedActualQuantity + newGetProductionScheduleId[0]["jobcard"][i]["actualQuantity"];
          completedJobCardQuantity++;
        }
        else{
          newRequestQuantity = newRequestQuantity + newGetProductionScheduleId[0]["jobcard"][i]["requestedQuantity"];
          newActualQuantity = newActualQuantity + newGetProductionScheduleId[0]["jobcard"][i]["actualQuantity"];
          newJobCardQuantity++;

        }
      }
      console.log("inProgressRequestQuantity",inProgressRequestQuantity);
      console.log("pendingRequestQuantity",pendingRequestQuantity);
      console.log("completedRequestQuantity",completedRequestQuantity);
      console.log("newRequestQuantity",newRequestQuantity);
      console.log("inProgressActualQuantity",inProgressActualQuantity);
      console.log("pendingActualQuantity",pendingActualQuantity);
      console.log("completedActualQuantity",completedActualQuantity);
      console.log("newActualQuantity",newActualQuantity);
      console.log("inProgressJobCardQuantity",inProgressJobCardQuantity);
      console.log("pendingJobCardQuantity",pendingJobCardQuantity);
      console.log("completedJobCardQuantity",completedJobCardQuantity);
      console.log("newJobCardQuantity",newJobCardQuantity);

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
      // console.log(newGetProductionScheduleId.length);
      // for(var i=0; i<newGetProductionScheduleId.length; i++){
      //   if(newGetProductionScheduleId[i]["jobcard"][0] != null && newGetProductionScheduleId[i]["jobcard"][0] != undefined)
      //   jobCardData.push(newGetProductionScheduleId[i]["jobcard"]);
      // }
    }
    res.send(newGetProductionScheduleId);
  }
};
