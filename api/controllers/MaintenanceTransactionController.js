/**
 * MaintenanceTransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  update: async function(req,res){
    //var nodemailer = require('nodemailer');
    //var transporter = nodemailer.createTransport({
    //  service: 'Gmail',
    //  auth: {
    //    user: 'menikhil.kkamable@gmail.com',
    //    pass: 'dravid19'
    //  }
    //});

    var employeeBarcode = req.body.employeeBarcode;
    var employee = null;
    var employeeDBId = 0;
    if (employeeBarcode != undefined) {
      employees = await Employee.find({employeeId: employeeBarcode});
      if (employees.length > 0) {
        employeeDBId = employees[0].id;
      }
    } else {
      emplyeeId = null;
    }

    console.log("employeeDBId:  ", employeeDBId);

    // as request is just received it is now
    var maintenanceTime  = Date.now();
    var nextMaintenanceDate = 0;

    var machine = await Machine.find({id:req.body.machineId});
    if (machine.length > 0) {
        nextMaintenanceDate = maintenanceTime + (86400* machine[0].frequencyInDays);
    } else {
      return res.status(404).send('Machine not found.');
    }

    console.log("Current Date: " + maintenanceTime + "\tNext Date: " + nextMaintenanceDate);

    var machineUpdated = await Machine.update({ id:req.body.machineId })
    .set({
      maintenanceStatus:req.body.maintenanceStatus,
      lastMaintenanceBy: employeeDBId,
      lastMaintenanceOn: maintenanceTime,
      nextMaintenanceOn: nextMaintenanceDate,

    })
    .fetch();

    if(machineUpdated != null && machineUpdated != undefined){
      var MaintenanceTable = await MaintenanceTransaction.create({
        machineId: req.body.machineId,
        maintenanceOn : maintenanceTime,
        maintenanceBy : employeeDBId,
        remarks : req.body.remarks,
        partReplaced : req.body.partReplaced,
        machineStatus: req.body.maintenanceStatus,
        costOfPartReplaced: req.body.costOfPartReplaced,
      }).fetch();
      if(MaintenanceTable != null && MaintenanceTable != undefined){
        var EmployeeList = await Employee.find({
          notifyForMachineMaintenance:1
        });
      }
    }
    res.send(machineUpdated);
  }

};
