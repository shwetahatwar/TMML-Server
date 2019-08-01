/**
 * JobProcessSequenceRelationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {
  create: async function(req,res){
    var jobCard = await JobCard.find({
      id:req.body.jobId
    });
    if(jobCard[0]!=null&&jobCard[0]!=undefined){
      console.log(jobCard[0]["productionSchedulePartRelationId"]);
      var sequenceNumberNew = await JobProcessSequenceRelation.find({
        jobId:req.body.jobId,
      })
      .sort('id DESC');
      console.log("Line 18",sequenceNumberNew);
      var newSequenceNumber;
      if(sequenceNumberNew[0]!=null&&sequenceNumberNew[0]!=undefined){
        newSequenceNumber = sequenceNumberNew[0]["sequenceNumber"];
      }
      else{
        newSequenceNumber=0;
      }
      var productionSchedulePartRelationId = await ProductionSchedulePartRelation.find({
        id:jobCard[0]["productionSchedulePartRelationId"]
      });
      var checkProcessSequence;
      if(newSequenceNumber==0){
        checkProcessSequence=1;
      }
      else{
        checkProcessSequence = newSequenceNumber;
      }
      // console.log(productionSchedulePartRelationId);
      if(productionSchedulePartRelationId!=null&&productionSchedulePartRelationId!=undefined){
        console.log(productionSchedulePartRelationId[0]);
        var processSequenceId = await ProcessSequence.find({
          partId:productionSchedulePartRelationId[0]["partNumberId"],
          sequenceNumber:checkProcessSequence
        });
        var addedSequencecNumber = parseInt(newSequenceNumber) + 1;
        console.log("Line 44",addedSequencecNumber);
        if(processSequenceId[0]!=null && processSequenceId[0]!=undefined){
          console.log(processSequenceId[0]);
          var newJobProcess = await JobProcessSequenceRelation.create({
            jobId:req.body.jobId,
            processSequenceId:processSequenceId[0]["id"],
            machineId:req.body.machineId,
            locationId:req.body.locationId,
            quantity:0,
            note:"",
            processStatus:'Start',
            startTime:Date.now(),
            endTime:0,
            duration:0,
            operatorId:req.body.operatorId,
            sequenceNumber:addedSequencecNumber
          })
          .fetch()
          .catch((error)=>{console.log(error)});
          console.log("Line 63",newJobProcess);
          await Machine.update({
            id : req.body.machineId
          })
          .set({
            maintenanceStatus:"Occupied"
          });
          console.log(newJobProcess);
          await JobCard.update({
            id:req.body.jobId
          })
          .set({
            jobcardStatus:"In Progress"
          });
          var getMachine = await Machine.findOne({
            id: req.body.machineId
          });
          if(getMachine["isAutomacticCount"] == 1){
            await MachineStrokes.create({
              machineId:req.body.machineId,
              strokes:0,
              startTime:Date.now(),
              endTime:0,
              multifactor:req.body.multifactor
            });
          }
          res.send(newJobProcess);
          var sourceLocation = await Location.find({
            barcodeSerial:req.body.sourceLocation
          });
          var jobLocationRelationId = await Joblocationrelation.findOne({
            jobcardId:req.body.jobId,
            processStatus:"Pending",
            sourceLocation:sourceLocation["id"]
          });
          if(jobLocationRelationId!=null&&jobLocationRelationId!=undefined){
            await Joblocationrelation.update({
              id:jobLocationRelationId["id"]
            })
            .set({
              destinationLocationId:req.body.machineId,
              processStatus:"Complete"
            });
          }
        }
        else{
          res.send("Process Sequence not found");
        }
      }
      else{
        res.send("Production Schedule Part Relation Not Found");
      }
    }
    else{
      res.send("Job Card Not Found");
    }
  },
  update: async function(req,res){
    if(req.body.machineStrockId != null&& req.body.machineStrockId!=undefined){
      await MachineStrokes.update({
        id:req.body.machineStrockId
      })
      .set({
        endTime:Date.now()
      });
    }
    var newJobProcessSequenceId = await JobProcessSequenceRelation.find({
      jobId:req.body.jobcardId,
      machineId:req.body.machineId,
      endTime:0
    });
    // console.log("Line 112",newJobProcessSequenceId[0]["id"]);
    var machineBarcode = await Machine.find({
      id:req.body.machineId
    });
    var newLocationBarcode = await Location.find({
      barcodeSerial:machineBarcode[0]["barcodeSerial"]
    });
    var newJobProcess = await JobProcessSequenceRelation.update({
      id:newJobProcessSequenceId[0]["id"]
    })
    .set({
      quantity:req.body.quantity,
      processStatus:req.body.processStatus,
      duration:req.body.duration,
      locationId:newLocationBarcode[0]["id"],
      note:req.body.note,
      endTime:Date.now()
    })
    .fetch();
    // console.log(newJobProcess);
    await Machine.update({
      id : req.body.machineId
    })
    .set({
      maintenanceStatus:"Available"
    });
    console.log("Line 138",newJobProcessSequenceId[0]["processSequenceId"]);
    var newPartNumberId = await ProcessSequence.find({
      id:newJobProcessSequenceId[0]["processSequenceId"]
    });
    var sequenceNumber = parseInt(newJobProcessSequenceId[0]["sequenceNumber"]) + 1;
    console.log("Line 140",sequenceNumber);
    var processSequence = await ProcessSequence.find({
      // id:newJobProcessSequenceId[0]["processSequenceId"],
      sequenceNumber:sequenceNumber,
      partId:newPartNumberId[0]["partId"]
    });
    console.log("Line 145",processSequence[0]);
    if(processSequence[0]!=null&&processSequence[0]!=undefined){

      var machineGroupNew = await Machine.find()
      .populate('machineGroupId');
      var suggestedLocations = "";
      for(var i=0;i<machineGroupNew.length;i++){
        console.log(machineGroupNew[i]["machineGroupId"][0]);
        if(processSequence[0]["machineGroupId"] == machineGroupNew[i]["machineGroupId"][0]["id"]){
          suggestedLocations = suggestedLocations + "," + machineGroupNew[i]["machineName"];
        }
      }

      await Joblocationrelation.create({
        jobcardId:req.body.jobcardId,
        jobProcessSequenceRelationId:newJobProcessSequenceId[0]["id"],
        sourceLocation:newLocationBarcode[0]["id"],
        suggestedDropLocations:suggestedLocations,
        processStatus:"Pending"
      });
      res.send(newJobProcessSequenceId[0]);
      // var newJobProcess = await JobProcessSequenceRelation.update({
      //   id:newJobProcessSequenceId[0]["id"]
      // })
      // .set({
      //   sequenceNumber:sequenceNumber
      // });
      // var processSequenceMachines = await ProcessSequenceMachineRelation.find({
      //   processSequenceId:processSequence["id"],
      // });
      // console.log(processSequenceMachines);
      // var barcodeLocation = await Machine.find({
      //   id:req.body.machineId
      // });
      // console.log(barcodeLocation);
      // var barcodeLocationSerial = await Location.find({
      //   barcodeSerial:barcodeLocation["barcodeSerial"]
      // });
      // console.log(processSequenceMachines[0]["machineId"]);
      // var multiplyMachines = "";
      // for(var i=0;i<processSequenceMachines.length;i++){
      //   var machineId = await Machine.find({
      //     id:processSequenceMachines[i]["machineId"]
      //   });
      //   console.log("Line 170", machineId);
      //   multiplyMachines = multiplyMachines + "," + machineId[0]["machineName"];
      //   if(i == processSequenceMachines.length-1){
      //     await Joblocationrelation.create({
      //       jobcardId:req.body.jobcardId,
      //       jobProcessSequenceRelationId:newJobProcessSequenceId[0]["id"],
      //       sourceLocation:barcodeLocationSerial[0]["id"],
      //       suggestedDropLocations:multiplyMachines,
      //       processStatus:"Pending"
      //     });
      //   }
      // }
      // console.log(multiplyMachines);
      // res.send(newJobProcessSequenceId[0]);
    }
    else{
      var newJobProcess = await JobProcessSequenceRelation.update({
        id:newJobProcessSequenceId[0]["id"]
      })
      .set({
        processStatus:"FinalLocation",
      })
      .fetch();
      await JobProcessSequenceTransaction.create({
        jobCardId:req.body.jobcardId,
        jobProcessSequenceRelation:newJobProcessSequenceId[0]["id"],
        quantity:req.body.quantity
      });
      var machineBarcode = await Machine.find({
        id:req.body.machineId
      });
      var newLocationBarcode = await Location.find({
        barcodeSerial:machineBarcode[0]["barcodeSerial"]
      });
      await Joblocationrelation.create({
        jobcardId:req.body.jobcardId,
        jobProcessSequenceRelationId:0,
        sourceLocation:newLocationBarcode[0]["id"],
        suggestedDropLocations:"Store",
        processStatus:"Pending"
      });
      var checkJobProcessSequence = await JobProcessSequenceRelation.find({
        jobId:req.body.jobcardId,
        processStatus:"Pending"
      });
      if(checkJobProcessSequence[0]!=null&&checkJobProcessSequence[0]!=undefined){
      }
      else{
        // var checkJobProcessSequence1 = await JobProcessSequenceRelation.find({
        //   jobId:req.body.jobcardId,
        //   processStatus:"Complete"
        // });
        // if(checkJobProcessSequence1[0]!=null&&checkJobProcessSequence1[0]!=undefined){
        // }
        // else{
          var jobProcessSequenceTransaction = await JobProcessSequenceTransaction.find({
            jobCardId:req.body.jobcardId
          });
          var quantity =0;
          for(var i =0;i<jobProcessSequenceTransaction.length;i++){
            quantity = quantity + parseInt(jobProcessSequenceTransaction[0]["quantity"]);
          }
          var dateTime = new Date();
          var updatedJobCard = await JobCard.update({
            id:req.body.jobcardId
          })
          .set({
            jobcardStatus:"Completed",
            actualQuantity:quantity
          });
          console.log(updatedJobCard);
          console.log(req.body.jobcardId +"Line 224");
          var jobProcessSequenceRelation = await JobProcessSequenceRelation.find({
            jobId:req.body.jobcardId
          });
          console.log(jobProcessSequenceRelation[0]["processSequenceId"]);
          var processSequence = await ProcessSequence.find({
            id:jobProcessSequenceRelation[0]["processSequenceId"]
          });
          console.log("Process Sequence" + processSequence);
          var partNumber = await PartNumber.find({
            id:processSequence[0]["partId"]
          });
          var jobCardBarcode = await JobCard.find({
            id:req.body.jobcardId
          });
          await SapTransaction.create({
            plant:"Tata Marcopolo Dharwad",
            date:dateTime,
            material:partNumber[0]["partNumber"],
            jobCard:jobCardBarcode[0]["barcodeSerial"],
            uniqueNumber:dateTime,
            quantity:quantity,
            documentNumber: 0
          });
        // }
      }
      res.send("Final Location");
    }
  },
  getData:async function(req,res){
    var newJobProcessSequenceRelationJson=[];
    var jobProcessSequenceRelationNew = await JobProcessSequenceRelation.find()
    .populate('jobId')
    .populate('processSequenceId')
    .populate('machineId')
    .populate('locationId')
    .populate('operatorId');
    for(var i=0;i<jobProcessSequenceRelationNew.length;i++){
      console.log(jobProcessSequenceRelationNew[i]["processStatus"]);
      if(jobProcessSequenceRelationNew[i]["processStatus"]!="New"){
        newJobProcessSequenceRelationJson.push(jobProcessSequenceRelationNew[i]);
      }
    }
    console.log(newJobProcessSequenceRelationJson);
    res.send(newJobProcessSequenceRelationJson);
  },
  stopProcess:async function(req,res){
    if(req.body.machineStrockId != null&& req.body.machineStrockId!=undefined){
      await MachineStrokes.update({
        id:req.body.machineStrockId
      })
      .set({
        endTime:Date.now()
      });
    }
    var newJobProcessSequenceId = await JobProcessSequenceRelation.find({
      jobId:req.body.jobcardId,
      machineId:req.body.machineId,
      endTime:0
    });
    // console.log("Line 112",newJobProcessSequenceId[0]["id"]);
    var machineBarcode = await Machine.find({
      id:req.body.machineId
    });
    var newLocationBarcode = await Location.find({
      barcodeSerial:machineBarcode[0]["barcodeSerial"]
    });
    var newJobProcess = await JobProcessSequenceRelation.update({
      id:newJobProcessSequenceId[0]["id"]
    })
    .set({
      quantity:req.body.quantity,
      processStatus:req.body.processStatus,
      duration:req.body.duration,
      locationId:newLocationBarcode[0]["id"],
      note:req.body.note,
      endTime:Date.now()
    })
    .fetch();
    // console.log(newJobProcess);
    await Machine.update({
      id : req.body.machineId
    })
    .set({
      maintenanceStatus:"Available"
    });
    var newJobProcess = await JobProcessSequenceRelation.update({
        id:newJobProcessSequenceId[0]["id"]
      })
      .set({
        processStatus:"FinalLocation",
      })
      .fetch();
      await JobProcessSequenceTransaction.create({
        jobCardId:req.body.jobcardId,
        jobProcessSequenceRelation:newJobProcessSequenceId[0]["id"],
        quantity:req.body.quantity
      });
      var machineBarcode = await Machine.find({
        id:req.body.machineId
      });
      var newLocationBarcode = await Location.find({
        barcodeSerial:machineBarcode[0]["barcodeSerial"]
      });
      await Joblocationrelation.create({
        jobcardId:req.body.jobcardId,
        jobProcessSequenceRelationId:0,
        sourceLocation:newLocationBarcode[0]["id"],
        suggestedDropLocations:"Store",
        processStatus:"Pending"
      });
      var checkJobProcessSequence = await JobProcessSequenceRelation.find({
        jobId:req.body.jobcardId,
        processStatus:"Pending"
      });
      if(checkJobProcessSequence[0]!=null&&checkJobProcessSequence[0]!=undefined){
      }
      else{
          var jobProcessSequenceTransaction = await JobProcessSequenceTransaction.find({
            jobCardId:req.body.jobcardId
          });
          var quantity =0;
          for(var i =0;i<jobProcessSequenceTransaction.length;i++){
            quantity = quantity + parseInt(jobProcessSequenceTransaction[0]["quantity"]);
          }
          var dateTime = new Date();
          var updatedJobCard = await JobCard.update({
            id:req.body.jobcardId
          })
          .set({
            jobcardStatus:"Completed",
            actualQuantity:quantity
          });
          console.log(updatedJobCard);
          console.log(req.body.jobcardId +"Line 224");
          var jobProcessSequenceRelation = await JobProcessSequenceRelation.find({
            jobId:req.body.jobcardId
          });
          console.log(jobProcessSequenceRelation[0]["processSequenceId"]);
          var processSequence = await ProcessSequence.find({
            id:jobProcessSequenceRelation[0]["processSequenceId"]
          });
          console.log("Process Sequence" + processSequence);
          var partNumber = await PartNumber.find({
            id:processSequence[0]["partId"]
          });
          var jobCardBarcode = await JobCard.find({
            id:req.body.jobcardId
          });
          await SapTransaction.create({
            plant:"Tata Marcopolo Dharwad",
            date:dateTime,
            material:partNumber[0]["partNumber"],
            jobCard:jobCardBarcode[0]["barcodeSerial"],
            uniqueNumber:dateTime,
            quantity:quantity,
            documentNumber: 0
          });
        // }
      }
  }
};