/**
 * MaintenanceTransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var nodemailer = require ('nodemailer');

module.exports = {
  update: async function(req,res){
    // var nodemailer = require('nodemailer');
    // var transporter = nodemailer.createTransport({
    //  service: 'Gmail',
    //  auth: {
    //    user: 'menikhil.kkamable@gmail.com',
    //    pass: 'dravid19'
    //  }
    // });

    var selfSignedConfig = {
      host: '128.9.24.24',
      port: 25
    };
    var transporter = nodemailer.createTransport(selfSignedConfig);

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
        var newEmployeeList = await Employee.find({
          notifyForMachineMaintenance:1
        });
        var newEmailService = await MailConfig.find({
          maintenanceStatus:req.body.maintenanceStatus
        });
        var machine = await Machine.find({
          id:req.body.machineId
        });
        var machineName = machine[0]["machineName"];
        var cellName = machine[0]["cellId"]["name"]
        var mailSubject = newEmailService[0].mailSubject;
        mailSubject = mailSubject.replace("%MACHINE%",machineName);
        mailSubject = mailSubject.replace("%STATUS%",req.body.maintenanceStatus);
        mailText= newEmailService[0].mailBody;
        mailText = mailSubject.replace("%NAME%",machineName);
        mailText = mailSubject.replace("%MACHINE%",machineName);
        mailText = mailSubject.replace("%CELL%",cellName);
        mailText = mailText.replace("%STATUS%",req.body.maintenanceStatus);
        mailText = mailText.replace("%OPERATOR%",req.body.userName);
        mailText = mailText.replace("%PART%",req.body.partReplaced);
        mailText = mailText.replace("%REMARKS%",req.body.remarks);

        if(newEmployeeList[0]!=null&&newEmployeeList[0]!=undefined){
          for(var i=0;i<newEmployeeList.length;i++){
            var mailOptions = {
              from: newEmailService[0].senderUsername, // sender address (who sends)
              to: newEmployeeList[i].email, // list of receivers (who receives)
              subject: mailSubject, // Subject line
              text: mailText
            };
            transporter.sendMail(mailOptions, function(error, info) {
              if(error){
                console.log(error);
              } else {
                console.log('Message sent: ' + info.response);
              }
            });
          }
        }

      }
    }
    res.send(machineUpdated);
  }
};
