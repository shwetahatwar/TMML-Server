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
    var machineUpdated = await Machine.update({ id:req.body.machineId })
    .set({
      maintenanceStatus:req.body.maintenanceStatus
    })
    .fetch();
    if(machineUpdated != null && machineUpdated != undefined){
      var MaintenanceTable = await MaintenanceTransaction.create({
        machineId: req.body.machineId,
        maintenanceOn : req.body.maintenanceOn,
        maintenanceBy : req.body.maintenanceBy,
        remarks : req.body.remarks,
        partReplaced : req.body.partReplaced,
        machineStatus: req.body.maintenanceStatus,
        costOfPartReplaced: req.body.costOfPartReplaced,
      }).fetch();
      if(MaintenanceTable!=null && MaintenanceTable != undefined){
        var EmployeeList = await Employee.find({
          notifyForMachineMaintenance:1
        });
        //for(var i =0; i<EmployeeList.length;i++){
        //  var emailFor = EmployeeList[0]["email"];
        //  var mailOptions = {
        //    from: 'menikhil.kkamable@gmail.com',
        //    to: emailFor,
        //    subject: req.body.maintenanceStatus,
        //    text: req.body.machineId + "is " + req.body.maintenanceStatus
        //  };

          //transporter.sendMail(mailOptions, function(error, info){
          //  if (error) {
          //    console.log(error);
          //  } else {
          //    console.log('Email sent: ' + info.response);
          //  }
          //});
        //}
      }
    }
    res.send(machineUpdated);
  }

};

