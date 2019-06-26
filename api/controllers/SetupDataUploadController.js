/**
 * SetupDataUploadController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 var XLSX = require('xlsx'),
     xls_utils = XLSX.utils;

// './assets/data/health_services.txt'

module.exports = {

  seedDatabase: async function(req, res) {

    // AccessLevel
    var filepath00 = './documents/templates/bulk-upload/01-BulkUploadRole.xlsx';
    var workbook00 = XLSX.readFile(filepath00);
    var sheet00 = workbook00.Sheets[workbook00.SheetNames[0]];
    var num_rows00 = xls_utils.decode_range(sheet00['!ref']).e.r;
    var json00 = [];
    for(var i = 1, l = num_rows00; i <= l; i++){
      var name = xls_utils.encode_cell({c:0, r:i});
      var value = sheet00[name];
      var result = value['v'];
      console.log(name + " \t" + result);
      json00.push({roleName: result});
    }

    // add to Accesslevel
    var role = await Role.createEach(json00);

    // AccessLevel
    var filepath0 = './documents/templates/bulk-upload/01-BulkUploadAccessLevelURI.xlsx';
    var workbook0 = XLSX.readFile(filepath0);
    var sheet0 = workbook0.Sheets[workbook0.SheetNames[0]];
    var num_rows0 = xls_utils.decode_range(sheet0['!ref']).e.r;
    var json0 = [];
    for(var i = 1, l = num_rows0; i <= l; i++){
      var name = xls_utils.encode_cell({c:0, r:i});
      var value = sheet0[name];
      var uriResult = value['v'];

      var httpMethod = xls_utils.encode_cell({c:1, r:i});
      var httpMethodValue = sheet0[httpMethod];
      var httpMethodResult = httpMethodValue['v'];

      console.log(name + " \t" + uriResult);
      json0.push({uri: uriResult, httpMethod: httpMethodResult});
    }

    // add to Accesslevel
    var accessLevel = await AccessLevel.createEach(json0);

    // Read Department
    var filepath1 = './documents/templates/bulk-upload/01-BulkUploadDepartment.xlsx';
    var workbook1 = XLSX.readFile(filepath1);
    var sheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
    var num_rows1 = xls_utils.decode_range(sheet1['!ref']).e.r;
    var json1 = [];
    for(var i = 1, l = num_rows1; i <= l; i++){
      var name = xls_utils.encode_cell({c:0, r:i});
      var value = sheet1[name];
      var result = value['v'];
      console.log(name + " \t" + result);
      json1.push({name: result, status: 1});
    }

    // add to Department
    var departments = await Department.createEach(json1);

    // Read Trolley Type
    var filepath02 = './documents/templates/bulk-upload/02-BulkUploadEmployee.xlsx';
    var workbook02 = XLSX.readFile(filepath02);
    var sheet02 = workbook02.Sheets[workbook02.SheetNames[0]];
    var num_rows02 = xls_utils.decode_range(sheet02['!ref']).e.r;
    var json02 = [];
    for(var i = 1, l = num_rows02; i <= l; i++){
      var employeeId = xls_utils.encode_cell({c:0, r:i});
      var employeeValue = sheet02[employeeId];
      var employeeResult = employeeValue['v'];
      console.log(employeeId + " \t" + employeeResult);

      var name = xls_utils.encode_cell({c:1, r:i});
      var value = sheet02[name];
      var nameResult = value['v'];
      console.log(name + " \t" + nameResult);

      var email = xls_utils.encode_cell({c:2, r:i});
      var emailValue = sheet02[email];
      var emailResult = emailValue['v'];
      console.log(email + " \t" + emailResult);

      var mobileNumber = xls_utils.encode_cell({c:3, r:i});
      var mobileNumberValue = sheet02[mobileNumber];
      var mobileNumberResult = mobileNumberValue['v'];
      console.log(mobileNumber + " \t" + mobileNumberResult);

      var status = xls_utils.encode_cell({c:4, r:i});
      var statusValue = sheet02[status];
      var statusResult = statusValue['v'];
      console.log(status + " \t" + statusResult);

      var notifyForMachineMaintenance = xls_utils.encode_cell({c:5, r:i});
      var notifyForMachineMaintenanceValue = sheet02[notifyForMachineMaintenance];
      var notifyForMachineMaintenanceResult = notifyForMachineMaintenanceValue['v'];
      console.log(notifyForMachineMaintenance + " \t" + notifyForMachineMaintenanceResult);

      var department = xls_utils.encode_cell({c:6, r:i});
      var departmentValue = sheet02[department];
      var departmentResult = departmentValue['v'];
      console.log(department + " \t" + departmentResult);
      var departmentId = null;

      // add to Department
      await Department.find({name: departmentResult}).then((dep) => {
        var depId = null;
        if (dep.length > 0) {
          depId = dep[0]['id'];
        }
        json02.push({
          employeeId: employeeResult,
          name: nameResult,
          email: emailResult,
          mobileNumber:  mobileNumberResult,
          status: statusResult,
          notifyForMachineMaintenance: notifyForMachineMaintenanceResult,
          department: depId
        });
      });
    }
    var employees = await Employee.createEach(json02);

    // Read Users
    var filepath03 = './documents/templates/bulk-upload/03-BulkUploadUser.xlsx';
    var workbook03 = XLSX.readFile(filepath03);
    var sheet03 = workbook03.Sheets[workbook03.SheetNames[0]];
    var num_rows03 = xls_utils.decode_range(sheet03['!ref']).e.r;
    var json03 = [];
    for(var i = 1, l = num_rows03; i <= l; i++){
      var name = xls_utils.encode_cell({c:0, r:i});
      var value = sheet03[name];
      var result = value['v'];
      console.log("User: " + name + " \t" + result);

      var password = xls_utils.encode_cell({c:1, r:i});
      var passwordValue = sheet03[password];
      var passwordResult = passwordValue['v'];
      console.log("User password: " + password + " \t" + passwordResult);

      var employeeId = xls_utils.encode_cell({c:2, r:i});
      var employeeIdValue = sheet03[employeeId];
      var employeeIdResult = employeeIdValue['v'];
      console.log("User Employee Id: " + employeeId + " \t" + employeeIdResult);

      var role = xls_utils.encode_cell({c:3, r:i});
      var roleValue = sheet03[role];
      var roleResult = roleValue['v'];
      console.log("User Role: " + role + " \t" + roleResult);

      // employee id
      await Employee.find({employeeId: employeeIdResult}).then(async (emp) => {
        // return emp['id']
        var empId = null;
        if (emp.length > 0) {
          empId = emp[0]['id'];
        }

        // role
        await Role.find({roleName: roleResult}).then( async (role) => {
          var roleIdentifer = null;
          if (role.length > 0) {
            roleIdentifer = role[0]['id'];
          }

          // console.log('Role: ' +  role +  '\nroleIdentifer: ' +  roleIdentifer);

          json03.push({name: result, password: passwordResult, employeeId: empId, role: roleIdentifer});

        });
      });

      // var role = xls_utils.encode_cell({c:3, r:i});
      // var roleValue = sheet03[role];
      // var roleResult = roleValue['v'];
      // console.log(role + " \t" + roleResult);
      //
      // // role
      // var roleIdentifier = await Role.find({roleName: roleResult}).then((role) => {
      //   return role['id']
      // });

      // json03.push({name: result, password: passwordResult, employeeId: empId, role: roleIdentifier});
    }
    var users = await User.createEach(json03);


    // Read Trolley Type
    var filepath04 = './documents/templates/bulk-upload/04-BulkUploadTrolleyType.xlsx';
    var workbook04 = XLSX.readFile(filepath04);
    var sheet04 = workbook04.Sheets[workbook04.SheetNames[0]];
    var num_rows04 = xls_utils.decode_range(sheet04['!ref']).e.r;
    var json04 = [];
    for(var i = 1, l = num_rows04; i <= l; i++){
      var name = xls_utils.encode_cell({c:0, r:i});
      var value = sheet04[name];
      var result = value['v'];
      console.log(name + " \t" + result);
      json04.push({name: result});
    }
    var trolleyTypes = await TrolleyType.createEach(json04);

    // Read Materialtype
    var filepath05 = './documents/templates/bulk-upload/05-BulkUploadRawMaterialType.xlsx';
    var workbook05 = XLSX.readFile(filepath05);
    var sheet05 = workbook05.Sheets[workbook05.SheetNames[0]];
    var num_rows05 = xls_utils.decode_range(sheet05['!ref']).e.r;
    var json05 = [];
    for(var i = 1, l = num_rows05; i <= l; i++){
      var name = xls_utils.encode_cell({c:0, r:i});
      var value = sheet05[name];
      var result = value['v'];
      console.log(name + " \t" + result);
      json05.push({name: result});
    }
    var materialTypes = await MaterialType.createEach(json05);

    // Read Cell
    var filepath08 = './documents/templates/bulk-upload/08-BulkUploadMachineCell.xlsx';
    var workbook08 = XLSX.readFile(filepath08);
    var sheet08 = workbook08.Sheets[workbook08.SheetNames[0]];
    var num_rows08 = xls_utils.decode_range(sheet08['!ref']).e.r;
    var json08 = [];
    for(var i = 1, l = num_rows08; i <= l; i++){
      var name = xls_utils.encode_cell({c:0, r:i});
      var value = sheet08[name];
      var result = value['v'];
      console.log(name + " \t" + result);
      json08.push({name: result});
    }
    var cells = await Cell.createEach(json08);

    // Costcenter
    var filepath10 = './documents/templates/bulk-upload/10-BulkUploadCostCenter.xlsx';
    var workbook10 = XLSX.readFile(filepath10);
    var sheet10 = workbook10.Sheets[workbook10.SheetNames[0]];
    var num_rows10 = xls_utils.decode_range(sheet10['!ref']).e.r;
    var json10 = [];
    for(var i = 1, l = num_rows10; i <= l; i++){
      var name = xls_utils.encode_cell({c:0, r:i});
      var value = sheet10[name];
      var result = value['v'];
      console.log(name + " \t" + result);
      json10.push({name: result});
    }
    var cells = await CostCenter.createEach(json10);

    return res.status(200).send("Seed Database");
  }
};
