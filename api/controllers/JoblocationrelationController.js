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
    console.log(location);
  	if(location[0]["locationType"]=="Machine"){
  		status = "Complete"
  	}
    else if(location[0]["locationType"]=="Kanban Location"){
      status = "Final Location"
    }
  	else{
  		var newJoblocationrelation = await Joblocationrelation.create({
  			jobcardId:location["jobCardId"],
  			jobProcessSequenceRelationId:location["jobProcessSequenceRelationId"],
  			sourceLocation:location["id"],
  			multiplyMachines:location["multiplyMachines"],
  			processStatus:"Pending"
  		});
  		console.log("Line 34",newJoblocationrelation);
  		status = "In Buffer"
  	}
  	await Joblocationrelation.update({
  		id:req.body.jobLocationRelationId
  	})
  	.set({
  		destinationLocationId:location[0]["id"],
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
  },

  getData:async function(req,res){
    // console.log("Line 57 Job Location");
    // var jobLocationRelation = await Joblocationrelation.find({
    //   processStatus: { '!=' : 'Complete' }
    // })
    // .populate('jobcardId');
    // res.send(jobLocationRelation);
    var newJoblocationrelationJson=[];
    var jobLocationRelationNew = await Joblocationrelation.find()
    .populate('sourceLocation')
    .populate('jobcardId')
    .populate('destinationLocationId');
    // console.log(jobLocationRelationNew[0]);
    for(var i=0;i<jobLocationRelationNew.length;i++){
      console.log(jobLocationRelationNew[i]["processStatus"]);
      if(jobLocationRelationNew[i]["processStatus"]!="Complete"){
        newJoblocationrelationJson.push(jobLocationRelationNew[i]);
      }
    }
    console.log(newJoblocationrelationJson);
    res.send(newJoblocationrelationJson);
  }

};

