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
      status:req.body.status,
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
    await JobCard.update({
      id:req.body.jobId
    })
    .set({
      status:"In Progress"
    })
    await MachineStrockes.create({
      machineId:req.body.machineId,
      strokes:0,
      startTime:req.body.startTime,
      endTime:req.body.endTime,
      multifactor:req.body.multifactor
    })
    res.send(newJobProcess);
  } 

  update: async function(req,res){
    await MachineStrockes.update({
      id:req.body.machineStrockId,
      endTime:req.body.endTime
    })
    var newJobProcess = await JobProcessSequenceRelation.update({
      id:req.body.JobProcessSequenceId
    })
    .set({
      quantity:req.body.quantity,
      status:req.body.status,
      endTime:req.body.endTime,
      duration:req.body.duration,
    });
    await Machine.update({
      id : req.body.machineId
    })
    .set({
      status:"Occupied"
    });
    res.send(newJobProcess);
  }
};

