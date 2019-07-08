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
  }
};