/**
 * JobProcessSequenceRelationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function(req,res){
  	JobProcessSequenceRelation.create({
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
  	.catch((error)=>{console.log(error)});
  	res.sendStatus(200);
  } 

};

