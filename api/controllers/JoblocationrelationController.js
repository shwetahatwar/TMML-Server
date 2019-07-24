/**
 * JoblocationrelationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  move: async function(req,res){
  	var singleJoblocationrelation = await Joblocationrelation.find({
  		id:req.body.jobLocationRelationId
  	});
  	if(singleJoblocationrelation == null || singleJoblocationrelation == undefined)
  		res.send("Job Card Not Found");
  	var location = await Location.find({
  		barcodeSerial:req.body.barcodeSerial
  	});
  	if (location == null || location == undefined) {
  		res.send("Location Not Found");
  	}
  	var status;
  	if(location["locationType"]=="Machine"){
  		status = "Complete"
  	}
  	else{
  		var newJoblocationrelation = await Joblocationrelation.create({
  			jobcardId:location["jobCardId"],
  			jobProcessSequenceRelationId:location["jobProcessSequenceRelationId"],
  			sourceLocation:location["id"],
  			multiplyMachines:location["multiplyMachines"],
  			processStatus:"Pending"
  		});
  		console.log(newJoblocationrelation);
  		status = "In Buffer"
  	}
  	await Joblocationrelation.update({
  		id:req.body.jobLocationRelationId
  	})
  	.set({
  		destinationLocationId:location["id"],
  		processStatus:status
  	});
  	res.send(200);
  },

  update:async function(req,res){
    var jobLocationRelationId = await Joblocationrelation.update({
      id:req.body.jobLocationRelationId
    })
    .set({
      processStatus:"Picked"
    });
    res.send("Updated");
  }

};

