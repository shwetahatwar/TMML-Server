/**
 * JobToJobReroutingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create : async function(req,res){
  	var newJobCardId = await JobCard.create({
  		productionSchedulePartRelationId:req.body.productionSchedulePartRelationId,
  		trolleyId:req.body.trolleyId,
  		requestedQuantity:req.body.requestedQuantity,
  		actualQuantity:req.body.actualQuantity,
  		status:req.body.status,
  		estimatedDate:req.body.estimatedDate,
  		barcodeSerial:req.body.barcodeSerial
  	})
  	.fetch()
  	.catch((error)=>{console.log(error)});
  	console.log(newJobCardId);
  	await JobToJobRerouting.create({
  		fromJobId:req.body.fromJobId,
  		fromProcessSequenceId:req.body.fromProcessSequenceId,
  		toJobId:newJobCardId["id"],
  		toProcessSequenceId:req.body.toProcessSequenceId,
  		quantity:req.body.quantity
  	});
  	res.send(newJobCardId);
  }

};

