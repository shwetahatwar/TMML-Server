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
    // console.log(sensor);
    var curr_date = d.getDate();
    var curr_month = parseInt(d.getMonth()) + 1;
    curr_month = ""+curr_month;
    // console.log(curr_month);
    if(curr_month.toString().length == 1){
      curr_month = "0" + curr_month
    }
    // console.log(curr_month);
    var curr_year = d.getFullYear();
    var barcodeSerial = "JO";
    var serialNumber;
    // console.log(getJobCard[0]["barcodeSerial"]);
    if(getJobCard[0]!=null && getJobCard[0]!=undefined){
      var lastBarcodeDay = getJobCard[0]["barcodeSerial"];
      lastBarcodeDay = lastBarcodeDay.substring(8,10);
      // console.log(lastBarcodeDay);
      // console.log(curr_date);
      if(lastBarcodeDay == curr_date){

        var lastSerialNumber = getJobCard[0]["barcodeSerial"];
        lastSerialNumber = lastSerialNumber.substring(10,13);
        console.log(lastSerialNumber);
        serialNumber = parseInt(lastSerialNumber) + 1;
        if(serialNumber.toString().length == 1){
          serialNumber = "00" + serialNumber
        }
        else if(serialNumber.toString().length == 2){
          serialNumber = "0" + serialNumber
        }
      }
      else{
        serialNumber = "001";
      }
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
  		currentLocation:req.body.currentLocation,
      jobcardStatus:req.body.jobcardStatus
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

