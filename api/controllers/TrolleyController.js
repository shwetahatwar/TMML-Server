/**
 * AppTrolleyController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function(req,res){

    var getTrolley = await Trolley.find()
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
    var barcodeSerial = "MA";
    var serialNumber;
    if(getTrolley[0]!=null && getTrolley[0]!=undefined){
      var BarcodeDay = getTrolley[0]["barcodeSerial"];
      lastBarcodeDay = BarcodeDay.substring(8,10);
      // console.log(lastBarcodeDay);
      var lastBarcodeMintues=BarcodeDay.substring(10,23);
      if(lastBarcodeDay == curr_date){
        if(curr_time == lastBarcodeMintues){
          var lastSerialNumber = getTrolley[0]["barcodeSerial"];
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
      serialNumber = "001";
    }

    barcodeSerial = barcodeSerial + curr_year + curr_month + curr_date + curr_time + serialNumber;
  	var Trolley = await Trolley.create({
  		capacity:req.body.capacity,
  		typeId:req.body.typeId,
  		materialTypeId:req.body.materialTypeId,
  		barcodeSerial:barcodeSerial,
  		status:req.body.status
  	})
  	.fetch()
  	.catch((error)=>{
  		console.log(error);
  	});
		res.send(Trolley);
	}
};

