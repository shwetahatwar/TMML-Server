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
    var curr_month = parseInt(d.getMonth()) + 1;
    curr_month = ""+curr_month;
    if(curr_month.toString().length == 1){
      curr_month = "0" + curr_month
    }
    var curr_year = d.getFullYear();
    var barcodeSerial;
    var serialNumber;
    if(getLocation[0]!=null && getLocation[0]!=undefined){
    	if(getLocation[0]["barcodeSerial"] == "Store"){
    		barcodeSerial = "LS";
    	}
    	else if(getLocation[0]["barcodeSerial"] == "Buffer"){
    		barcodeSerial = "LB";
    	}
    	else{
    		barcodeSerial = "LK";
    	}
      var lastBarcodeDay = getLocation[0]["barcodeSerial"];
      lastBarcodeDay = lastBarcodeDay.substring(8,10);
      if(lastBarcodeDay == curr_date){

        var lastSerialNumber = getLocation[0]["barcodeSerial"];
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

    var location = await Location.create({
    	name:req.body.name,
      locationType:req.body.locationType,
      barcodeSerial:barcodeSerial
    });
    res.send(location);
  }

};

