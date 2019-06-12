/**
 * JobCardController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function(req,res){
  	var newJobCard = await JobCard.create({
  		productionSchedulePartRelationId:req.body.productionSchedulePartRelationId,
  		requestedQuantity:req.body.requestedQuantity,
  		actualQuantity:req.body.actualQuantity,
  		status:req.body.status,
  		estimatedDate:req.body.estimatedDate,
  		barcodeSerial:req.body.barcodeSerial,
  		currentLocation:req.body.currentLocation
  	})
  	.fetch()
  	.catch((error)=>{console.log(error)});
  	await JobLocationrelation.create({
  		jobcardId:newJobCard["id"],
  		jobProcessSequenceRelationId:0,
  		sourceLocation:"Stores",
  		destinationLocationId:req.body.destinationLocationId
  	})
  	.catch((error)=>{console.log(error)});
  	res.status(200).send(newJobCard);
  }

};

