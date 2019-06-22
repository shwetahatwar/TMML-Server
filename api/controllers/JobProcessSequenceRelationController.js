/**
 * JobProcessSequenceRelationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function(req,res){
    var newJobProcess = await JobProcessSequenceRelation.create({
      jobId:req.body.jobId,
      processSequenceId:req.body.processSequenceId,
      machineId:req.body.machineId,
      locationId:req.body.locationId,
      quantity:0,
      note:"",
      processStatus:'Start',
      startTime:Date.now(),
      endTime:0,
      duration:0,
      operatorId:req.body.operatorId,
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
  },

  

  update: async function(req,res){
    await MachineStrokes.update({
      id:req.body.machineStrockId
    })
    .set({
      endTime:Date.now()
    });
    var newJobProcessSequenceId = await JobProcessSequenceRelation.find({
      jobId:req.body.jobcardId,
      machineId:req.body.machineId
    });
    console.log(newJobProcessSequenceId);
    var newJobProcess = await JobProcessSequenceRelation.update({
      id:newJobProcessSequenceId["id"]
    })
    .set({
      quantity:req.body.quantity,
      processStatus:req.body.status,
      endTime:0,
      duration:req.body.duration,
    });
    await Machine.update({
      id : req.body.machineId
    })
    .set({
      maintenanceStatus:"Available"
    });

    var processSequence = await ProcessSequence.find({
      id:newJobProcessSequenceId["processSequenceId"]
    });

    
    var processSequenceMachines = await ProcessSequenceMachineRelation.find({
      processSequenceId:processSequence["id"]
    });
    var barcodeLocation = Machine.find({
      id:req.body.machineId
    });
    console.log(barcodeLocation);
    var barcodeLocationSerial = Location.find({
      barcodeSerial:barcodeLocation["barcodeSerial"]
    });
    console.log(barcodeLocationSerial);
    var multiplyMachines = "";
    for(var i=0;i<processSequenceMachines.length;i++){
      var machineId = await Machine.find({
        id:processSequenceMachines[i].machineId
      });
      multiplyMachines = multiplyMachines + "," + machineId.machineName;
      if(i == processSequenceMachines.length-1){
        await Joblocationrelation.create({
        jobcardId:req.body.jobcardId,
        jobProcessSequenceRelationId:newJobProcessSequenceId["id"],
        sourceLocation:barcodeLocationSerial["id"],
        suggestedDropLocations:multiplyMachines,
        processStatus:"Pending"
      });
      }
    }
    res.send(newJobProcess);

  },

};

