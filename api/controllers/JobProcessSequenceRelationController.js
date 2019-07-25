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
      var productionSchedulePartRelationId = await ProductionSchedulePartRelation.find({
        id:jobCard[0]["productionSchedulePartRelationId"]
      });
      // console.log(productionSchedulePartRelationId);
      if(productionSchedulePartRelationId!=null&&productionSchedulePartRelationId!=undefined){
        console.log(productionSchedulePartRelationId[0]);
        var processSequenceId = await ProcessSequence.find({
          partId:productionSchedulePartRelationId[0]["partNumberId"]
        });
        // console.log(processSequenceId[0]);
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
            sequenceNumber:0
          })
          .fetch()
          .catch((error)=>{console.log(error)});
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
    console.log(newJobProcessSequenceId[0]["id"]);
    var newJobProcess = await JobProcessSequenceRelation.update({
      id:newJobProcessSequenceId[0]["id"]
    })
    .set({
      quantity:req.body.quantity,
      processStatus:req.body.processStatus,
      duration:req.body.duration,
    })
    .fetch();
    // console.log(newJobProcess);
    await Machine.update({
      id : req.body.machineId
    })
    .set({
      maintenanceStatus:"Available"
    });
    console.log(newJobProcessSequenceId[0]["processSequenceId"]);
    var sequenceNumber = newJobProcessSequenceId[0]["sequenceNumber"] + 1;
    var processSequence = await ProcessSequence.find({
      id:newJobProcessSequenceId[0]["processSequenceId"],
      sequenceNumber:sequenceNumber
    });
    console.log(processSequence);
    if(processSequence[0!=null&&processSequence[0!=undefined]]){
      var newJobProcess = await JobProcessSequenceRelation.update({
        id:newJobProcessSequenceId[0]["id"]
      })
      .set({
        sequenceNumber:sequenceNumber
      });
      var processSequenceMachines = await ProcessSequenceMachineRelation.find({
        processSequenceId:processSequence["id"],
      });
      console.log(processSequenceMachines);
      var barcodeLocation = await Machine.find({
        id:req.body.machineId
      });
      console.log(barcodeLocation);
      var barcodeLocationSerial = await Location.find({
        barcodeSerial:barcodeLocation["barcodeSerial"]
      });
      console.log(processSequenceMachines[0]["machineId"]);
      var multiplyMachines = "";
      for(var i=0;i<processSequenceMachines.length;i++){
        var machineId = await Machine.find({
          id:processSequenceMachines[i]["machineId"]
        });
        console.log(machineId);
        multiplyMachines = multiplyMachines + "," + machineId[0]["machineName"];
        if(i == processSequenceMachines.length-1){
          await Joblocationrelation.create({
            jobcardId:req.body.jobcardId,
            jobProcessSequenceRelationId:newJobProcessSequenceId[0]["id"],
            sourceLocation:barcodeLocationSerial["id"],
            suggestedDropLocations:multiplyMachines,
            processStatus:"Pending"
          });
        }
      }
      console.log(multiplyMachines);
      res.send(newJobProcessSequenceId[0]);
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
      var checkJobProcessSequence = await JobProcessSequenceRelation.find({
        jobId:req.body.jobcardId,
        processStatus:"Pending"
      });
      if(checkJobProcessSequence[0]!=null&&checkJobProcessSequence[0]!=undefined){
      }
      else{
        var checkJobProcessSequence1 = await JobProcessSequenceRelation.find({
          jobId:req.body.jobcardId,
          processStatus:"Complete"
        });
        if(checkJobProcessSequence1[0]!=null&&checkJobProcessSequence1[0]!=undefined){
        }
        else{
          var jobProcessSequenceTransaction = await JobProcessSequenceTransaction.find({
            jobCardId:req.body.jobcardId
          });
          var quantity =0;
          for(var i =0;i<jobProcessSequenceTransaction.length;i++){
            quantity = quantity +jobProcessSequenceTransaction[0]["quantity"]
          }
          var dateTime = new Date();
          await JobCard.update({
            id:req.body.jobcardId
          })
          .set({
            jobcardStatus:"Completed",
            actualQuantity:quantity
          });
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
        }
      }
      res.send("Final Location");
    }
  },
};