/**
 * EmployeeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function(req,res){
    var employee = await Employee.create({
      employeeId:req.body.employeeId,
      name:req.body.name,
      email:req.body.email,
      mobileNumber:req.body.mobileNumber,
      barcodeSerial:req.body.employeeId,
      status:req.body.status,
      notifyForMachineMaintenance:req.body.notifyForMachineMaintenance,
      department:req.body.department
    });
    res.send(employee);
  },
    employeeBulkUpload:async function(req,res){
    // console.log(req.body.data);
    var data = JSON.parse(req.body.data);
    console.log(data);
    for(var i=0; i<data.length;i++){
      var notifyEmail;
      if(data[i]["Notify for Machine Maintenance"] == "No"){
        notifyEmail = 0
      }
      else{
        notifyEmail = 1
      }
      var department = await Department.find({
        name:data[i]["Department"]
      });
      await Employee.create({
        employeeId:data[i]["Employee Id"],
        name:data[i]["Name"],
        email:data[i]["Email"],
        mobileNumber:data[i]["Mobile"],
        barcodeSerial:data[i]["Employee Id"],
        status:data[i]["Status"],
        notifyForMachineMaintenance:notifyEmail,
        department:department[0]["id"]
      });
    }
    res.send("OKs");
  }
};