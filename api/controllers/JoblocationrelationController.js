/**
 * JoblocationrelationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  move: async function(req,res){
    var newMachineStatus;
    var newJoblocationrelationId;
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
    else{
    	var status;
      console.log(location);
    	if(location[0]["locationType"]=="Machine"){
    		status = "Complete"
        var machineStatus = await Machine.find({
          barcodeSerial:req.body.barcodeSerial
        });
        console.log("Line 29", machineStatus);
        if(machineStatus[0]["maintenanceStatus"] != "Available"){
          // res.send("Machine not Available");
          newMachineStatus = "notAvailable";
        }
    	}
      else if(location[0]["locationType"]=="Kanban Location"){
        status = "Final Location"
      }
    	else{
        // if(newMachineStatus == "notAvailable"){
      		var newJoblocationrelation = await Joblocationrelation.create({
      			jobcardId:location["jobCardId"],
      			jobProcessSequenceRelationId:location["jobProcessSequenceRelationId"],
      			sourceLocation:location["id"],
      			multiplyMachines:location["multiplyMachines"],
      			processStatus:"Pending"
      		});
      		console.log("Line 34",newJoblocationrelation);
      		status = "In Buffer"
        // }
    	}
      if(newMachineStatus != "notAvailable"){
      	newJoblocationrelationId = await Joblocationrelation.update({
      		id:req.body.jobLocationRelationId
      	})
      	.set({
      		destinationLocationId:location[0]["id"],
      		processStatus:status
      	})
        .fetch();
      }
      if(newMachineStatus == "notAvailable")
    	 res.status("Machine Not Available").send(404);
      else{
        console.log(newJoblocationrelationId);
       res.send(newJoblocationrelationId);
      }
    }
  },

  update:async function(req,res){
    console.log("Line 73", req.body);
    var jobLocationRelationId = await Joblocationrelation.update({
      id:req.body.jobLocationRelationId
    })
    .set({
      processStatus:"Picked"
    }).fetch();
    console.log(jobLocationRelationId);
    res.send(jobLocationRelationId);
  },

  getData:async function(req,res){
    var jobLocationRelationNew;
    var jobCardId = await JobCard.find({
      barcodeSerial: req.query.barcodeSerial
    });
    if(jobCardId[0] != null && jobCardId[0] != undefined){
      jobLocationRelationNew = await Joblocationrelation.find({
        jobcardId: jobCardId[0]["id"],
        processStatus: { '!=' : ['Complete', 'Final Location'] }
      })
      .populate('sourceLocation')
      .populate('jobcardId')
      .populate('destinationLocationId');
      console.log(jobLocationRelationNew);
    }
    res.send(jobLocationRelationNew);
    // var sql = `select * from joblocationrelation inner join location ON joblocationrelation.sourceLocation = location.id or joblocationrelation.destinationLocationId = location.id inner join jobcard ON joblocationrelation.jobcardId = jobcard.id where processStatus != 'Complete' and processStatus != 'Final Location'`;
    // var jobLocationRelationNew = await sails.sendNativeQuery(sql,[]);
    // console.log(jobLocationRelationNew);
    // res.send(jobLocationRelationNew);
  },
  getDataDesktop:async function(req,res){
    var limitCount = 500;
    var skipCount = 0;
    if (req.query.limit) {
     limitCount = req.query.limit;
    }
    if(req.query.skip){
      skipCount = req.query.skip;
    }
    var jobLocationRelationNew = await Joblocationrelation.find({
      where:{
        processStatus: { '!=' : ['Complete', 'Final Location'] }
      },limit:limitCount,sort: [{ id: 'DESC'}],skip:skipCount
    })
    .populate('sourceLocation')
    .populate('jobcardId')
    .populate('destinationLocationId');
    console.log(jobLocationRelationNew);
    res.send(jobLocationRelationNew);
  },

  getJobLocationRelationCount:async function(req,res){
    var jobLocationRelationNew = await Joblocationrelation.count({
      where:{
        processStatus: { '!=' : ['Complete', 'Final Location','Cancelled'] }
      }
    });
    var totalCount=[];
    var requestedData = {
      TotalCount:jobLocationRelationNew,
    }
    totalCount.push(requestedData);
    res.send(totalCount);
  }

};
