/**
 * JobCardController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function(req,res){

    var getJobCard = await JobCard.find()
    .sort('id DESC')
    .limit(1);

    var d = new Date();
    console.log(sensor);
    var curr_date = d.getDate();
    var curr_month = parseInt(d.getMonth()) + 1;
    var curr_year = d.getFullYear();
    var barcodeSerial = "J0";
    var serialNumber;

    var lastBarcodeDay = getJobCard["barcodeSerial"];
    lastBarcodeDay = lastBarcodeDay.substring(8,10);

    if(lastBarcodeDay == curr_month){
      var lastSerialNumber = getJobCard["barcodeSerial"];
      lastSerialNumber = lastSerialNumber.substring(16,18);
      serialNumber = lastSerialNumber + 1;
    }
    else{
      serialNumber = "001";
    }

    barcodeSerial = barcodeSerial + curr_year + curr_month + curr_date + serialNumber;

  	var newJobCard = await JobCard.create({
  		productionSchedulePartRelationId:req.body.productionSchedulePartRelationId,
  		requestedQuantity:req.body.requestedQuantity,
  		actualQuantity:req.body.actualQuantity,
  		status:req.body.status,
  		estimatedDate:req.body.estimatedDate,
  		barcodeSerial:barcodeSerial,
  		currentLocation:req.body.currentLocation
  	})
  	.fetch()
  	.catch((error)=>{console.log(error)});
  	console.log(newJobCard["id"]);
  	await Joblocationrelation.create({
  		jobcardId:newJobCard["id"],
  		jobProcessSequenceRelationId:0,
  		sourceLocation:1,
  		destinationLocationId:req.body.destinationLocationId,
      multiplyMachines:req.body.multiplyMachines,
  		status:"Pending"
  	})
  	.catch((error)=>{console.log(error)});
  	res.status(200).send(newJobCard);
  }

};

