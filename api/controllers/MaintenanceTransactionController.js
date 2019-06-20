/**
 * MaintenanceTransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  update: async function(req,res){
    var machineUpdated = await Machine.update({ id:req.body.machineId })
    .set({
      status:req.body.status
    })
    .fetch();
    var MaintenanceTable = await Maintenancetransaction.create({
      machineId: req.body.machineId,
      maintenanceOn : req.body.maintenanceOn,
      maintenanceBy : req.body.maintenanceBy,
      remarks : req.body.remarks,
      partReplaced : req.body.partReplaced,
      machineStatus : req.body.status
    }).fetch();
    res.send(machineUpdated);
  }

};

