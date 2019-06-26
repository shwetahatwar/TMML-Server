/**
 * AppMachineController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function(req,res){

    var getMachine = await Machine.find()
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
    var barcodeSerial = "MA";
    var serialNumber;
    if(getMachine[0]!=null && getMachine[0]!=undefined){
      var lastBarcodeDay = getMachine[0]["barcodeSerial"];
      lastBarcodeDay = lastBarcodeDay.substring(8,10);
      if(lastBarcodeDay == curr_date){

        var lastSerialNumber = getMachine[0]["barcodeSerial"];
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
  	var machine = await Machine.create({
  		machineName:req.body.machineName,
  		capacity:req.body.capacity	,
  		status:req.body.status,
  		barcodeSerial:barcodeSerial,
  		frequencyInDays:req.body.frequencyInDays,
  		machineTypeId:req.body.machineTypeId,
  		machineGroupId:req.body.machineGroupId,
  		costCenterId:req.body.costCenterId,
  		cellId:req.body.cellId,
      maintenanceStatus:req.body.maintenanceStatus
  	})
  	.fetch()
  	.catch((error)=>{
  		console.log(error);
  	}); 
  	await MachineFile.create({
  		machineId:machine["id"],
  		fileData:req.body.fileData,
  		fileType:req.body.fileType
  	})
  	.catch((error)=>{
  		console.log(error)
  	});
    await Location.create({
      name:machine["machineName"],
      locationType:"Machine",
      barcodeSerial:machine["barcodeSerial"]
    });
  	res.send(machine);
  }
};

