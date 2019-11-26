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
    var barcodeSerial;
    if(getMachine[0]!=null && getMachine[0]!=undefined){
      var getBarcode = getMachine[0]["barcodeSerial"];
      var counter = getBarcode.substring(2,6);
      counter = parseInt(counter) + 1;
      if(counter.toString().length == 1){
        counter = "00" + counter
      }else if(counter.toString().length == 2){
        counter = "0" + counter
      }else{
        counter = counter;
      }
      barcodeSerial = "MA"+counter;
    }
    else{
      barcodeSerial = "MA001"
    }
  	var machine = await Machine.create({
  		machineName:req.body.machineName,
  		capacity:req.body.capacity	,
  		status:req.body.status,
  		barcodeSerial:barcodeSerial,
  		frequencyInDays:req.body.frequencyInDays,
  		operationType:req.body.operationType,
  		machineGroupId:req.body.machineGroupId,
  		costCenterId:req.body.costCenterId,
  		cellId:req.body.cellId,
      maintenanceStatus:req.body.maintenanceStatus,
      nextMaintenanceOn:req.body.nextMaintenanceOn,
      machineWeight:req.body.machineWeight
  	})
  	.fetch()
  	.catch((error)=>{
      sails.log.error("Error while adding Machine",error);
  		console.log(error);
  	});
  	await MachineFile.create({
  		machineId:machine["id"],
  		fileData:req.body.fileData,
  		fileType:req.body.fileType
  	})
  	.catch((error)=>{
      sails.log.error("Error while adding Machine File",error);
  		console.log(error)
  	});
    await Location.create({
      name:machine["machineName"],
      locationType:"Machine",
      barcodeSerial:machine["barcodeSerial"]
    });
  	res.send(machine);
    sails.log.info("Machine Created",machine);
  }
};
