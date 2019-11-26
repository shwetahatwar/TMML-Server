/**
 * LocationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function(req,res){
  	var getLocation = await Location.find({
  		locationType:req.body.locationType
  	})
    .sort('id DESC')
    .limit(1);

    var d = new Date();
    var curr_date = d.getDate();
    var curr_date = d.getDate();
    if(curr_date.toString().length == 1){
      curr_date = "0" + curr_date
    }
    var curr_month = parseInt(d.getMonth()) + 1;
    curr_month = ""+curr_month;
    if(curr_month.toString().length == 1){
      curr_month = "0" + curr_month
    }
    var curr_year = d.getFullYear();
    var curr_time = d.getTime();
    var barcodeSerial;
    var serialNumber;
    // console.log(getLocation[0]);
    if(getLocation[0]!=null && getLocation[0]!=undefined){
    	if(getLocation[0]["locationType"] == "Raw Material Store"){
    		barcodeSerial = "LS";
    	}
    	else if(getLocation[0]["locationType"] == "Buffer"){
    		barcodeSerial = "LB";
    	}
    	else{
    		barcodeSerial = "LK";
    	}
      var BarcodeDay = getLocation[0]["barcodeSerial"];
      lastBarcodeDay = BarcodeDay.substring(8,10);
      console.log("lastBarcodeDay ",lastBarcodeDay);
      var lastBarcodeMintues=BarcodeDay.substring(10,23);
      console.log("lastBarcodeMintues ",lastBarcodeMintues);
      if(lastBarcodeDay == curr_date){
        if(curr_time == lastBarcodeMintues){
          var lastSerialNumber = getLocation[0]["barcodeSerial"];
          lastSerialNumber = lastSerialNumber.substring(23,26);
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
    }
    else{
      if(req.body.locationType == "Raw Material Store")
        barcodeSerial = "LS";
      else if(req.body.locationType == "Buffer")
        barcodeSerial = "LB";
      else
        barcodeSerial = "LK";
      serialNumber = "001";
    }

    barcodeSerial = barcodeSerial + curr_year + curr_month + curr_date + curr_time + serialNumber;

    var location = await Location.create({
    	name:req.body.name,
      locationType:req.body.locationType,
      barcodeSerial:barcodeSerial
    });
    res.send(location);
    sails.log.info("Location Created:",Location);
  }

};
