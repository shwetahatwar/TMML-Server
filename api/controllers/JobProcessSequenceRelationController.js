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
      quantity:req.body.quantity,
      note:req.body.note,
      status:'Start',
      startTime:req.body.startTime,
      endTime:req.body.endTime,
      duration:req.body.duration,
      operatorId:req.body.operatorId,
    })
    .fetch()
    .catch((error)=>{console.log(error)});
    await Machine.update({
      id : req.body.machineId
    })
    .set({
      status:"Occupied"
    });
    console.log(newJobProcess);
    await JobCard.update({
      id:req.body.jobId
    })
    .set({
      status:"In Progress"
    });
    await MachineStrokes.create({
      machineId:req.body.machineId,
      strokes:0,
      startTime:req.body.startTime,
      endTime:req.body.endTime,
      multifactor:req.body.multifactor
    });
    res.send(newJobProcess);

    var sourceLocation = await Location.find({
      barcodeSerial:req.body.sourceLocation
    });

    var jobLocationRelationId = await Joblocationrelation.findOne({
      jobcardId:req.body.jobId,
      status:"Pending",
      sourceLocation:sourceLocation["id"]
    });

    await Joblocationrelation.update({
      id:jobLocationRelationId["id"]
    })
    .set({
      destinationLocationId:req.body.machineId,
      status:"Complete"
    });
  },

  

  update: async function(req,res){
    await MachineStrokes.update({
      id:req.body.machineStrockId
    })
    .set({
      endTime:0
    });
    var newJobProcessSequenceId = await JobProcessSequenceRelation.findOne({
      jobId:req.body.jobcardId,
      machineId:req.body.machineId
    });
    console.log(newJobProcessSequenceId);
    var newJobProcess = await JobProcessSequenceRelation.update({
      id:newJobProcessSequenceId["id"]
    })
    .set({
      quantity:req.body.quantity,
      status:req.body.status,
      endTime:0,
      duration:req.body.duration,
    });
    await Machine.update({
      id : req.body.machineId
    })
    .set({
      status:"Available"
    });

    var processSequence = await ProcessSequence.find({
      id:newJobProcessSequenceId["processSequenceId"]
    });

    var multiplyMachines = "";
    var processSequenceMachines = await ProcessSequenceMachineRelation.find({
      processSequenceId:processSequence["id"]
    });
    for(var i=0;i<processSequenceMachines.length;i++){
      var machineId = await Machine.find({
        id:processSequenceMachines[i].machineId
      });
      multiplyMachines = multiplyMachines + "," + machineId[0].machineName;
      if(i == processSequenceMachines.length-1){
        await Joblocationrelation.create({
        jobcardId:req.body.jobcardId,
        jobProcessSequenceRelationId:newJobProcessSequenceId["id"],
        sourceLocation:req.body.machineId,
        multiplyMachines:multiplyMachines
      });
      }
    }
    res.send(newJobProcess);

  },

  
};

