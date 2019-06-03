/**
 * AppMachineController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  update: async function(req,res){
    ({id:req.body.machineId})
    await Machine.update({ id:req.body.machineId })
    .set({
      status:req.body.status
    })
    .then(async (machine)=>{
      console.log(machine);
      await MaintenanceTransaction.create({
        machineId: req.body.machineId,
        maintenanceOn : req.body.maintenanceOn,
        maintenanceBy : req.body.maintenanceBy,
        remarks : req.body.remarks,
        partReplaced : req.body.partReplaced,
        machineStatus : req.body.status
      })
      .then((maintenanceTransaction)=>{res.sendStatus(200).send(maintenanceTransaction)});
      // .catch(res.status(400).send("error"));
      // res.status(200).send("sucess")
    })
    // .catch((error)=>res.status(400).send(error));
  }
};

