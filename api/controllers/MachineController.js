/**
 * AppMachineController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function(req,res){
  	var machine = await Machine.create({
  		machineName:req.body.machineName,
  		capacity:req.body.capacity	,
  		status:req.body.status,
  		barcodeSerial:req.body.barcodeSerial,
  		frequencyInDays:req.body.frequencyInDays,
  		machineTypeId:req.body.machineTypeId,
  		machineGroupId:req.body.machineGroupId,
  		costCenterId:req.body.costCenterId,
  		cellId:req.body.cellId
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
  	res.send(machine);
  }
};

