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
      var emailResult = "";

      if (emailValue != undefined) {
        emailValue['v'];
        console.log(email + " \t" + emailResult);
      }

      var mobileNumber = xls_utils.encode_cell({c:3, r:i});
      var mobileNumberValue = sheet02[mobileNumber];
      var mobileNumberResult = "";
      if (mobileNumberValue != undefined) {
        mobileNumberResult = mobileNumberValue['v'];
       console.log(mobileNumber + " \t" + mobileNumberResult);
      }

      var status = xls_utils.encode_cell({c:4, r:i});
      var statusValue = sheet02[status];
      var statusResult = statusValue['v'];
      console.log(status + " \t" + statusResult);

      var notifyForMachineMaintenance = xls_utils.encode_cell({c:5, r:i});
      var notifyForMachineMaintenanceValue = sheet02[notifyForMachineMaintenance];
      var notifyForMachineMaintenanceResultData = notifyForMachineMaintenanceValue['v'];
      var notifyForMachineMaintenanceResult = 0;
      if (notifyForMachineMaintenanceResultData.toLowerCase().equals == "yes") {
        notifyForMachineMaintenanceResult = 1;
      }
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
      var userResult = value['v'];
      console.log("User: " + name + " \t" + userResult);

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

          json03.push({username: userResult, password: passwordResult, employeeId: empId, role: roleIdentifer});

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
      json05.push({name: result, status: 1});
    }
    var materialTypes = await MaterialType.createEach(json05);

    // machine type
    var filepath07 = './documents/templates/bulk-upload/07-BulkUploadMachineType.xlsx';
    var workbook07 = XLSX.readFile(filepath07);
    var sheet07 = workbook07.Sheets[workbook07.SheetNames[0]];
    var num_rows07 = xls_utils.decode_range(sheet07['!ref']).e.r;
    var json07 = [];
    for(var i = 1, l = num_rows07; i <= l; i++){
      var name = xls_utils.encode_cell({c:0, r:i});
      var value = sheet07[name];
      var result = value['v'];
      console.log(name + " \t" + result);
      json07.push({name: result, status: 1});
    }
    var machineTypes = await MachineType.createEach(json07);

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
      json08.push({name: result, status: 1});
    }
    var cells = await Cell.createEach(json08);

    // Group
    var filepath09 = './documents/templates/bulk-upload/09-BulkUploadMachineGroup.xlsx';
    var workbook09 = XLSX.readFile(filepath09);
    var sheet09 = workbook09.Sheets[workbook09.SheetNames[0]];
    var num_rows09 = xls_utils.decode_range(sheet09['!ref']).e.r;
    var json09 = [];
    for(var i = 1, l = num_rows09; i <= l; i++){
      var name = xls_utils.encode_cell({c:0, r:i});
      var value = sheet09[name];
      var result = value['v'];
      console.log(name + " \t" + result);

      var name2 = xls_utils.encode_cell({c:1, r:i});
      var value2 = sheet09[name2];
      var result2 = value2['v'];
      console.log(name2 + " \t" + result2);

      await MachineType.find({name: result2}).then( async (machineTypes) => {
          var machineTypeId = null;
          if (machineTypes.length > 0) {
            machineTypeId = machineTypes[0]['id'];
            json09.push({name: result, machineTypeId: machineTypeId, status: 1});
          }
      });
    }
    var machineGroups = await MachineGroup.createEach(json09);

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

    // machine details
    /*var filepath11 = './documents/templates/bulk-upload/11-BulkUploadMachineDetails.xlsx';
    var workbook11 = XLSX.readFile(filepath11);
    var sheet11 = workbook11.Sheets[workbook11.SheetNames[0]];
    var num_rows11 = xls_utils.decode_range(sheet11['!ref']).e.r;
    var json11 = [];
    for(var i = 1, l = num_rows11; i <= l; i++) {

      // machine name
      var cell0 = xls_utils.encode_cell({c:0, r:i});
      var cell0Object = sheet11[cell0];
      var cell0Value = cell0Object['v'];
      console.log(cell0 + " \t" + cell0Value);

      // machineTypeId
      var cell1 = xls_utils.encode_cell({c:1, r:i});
      var cell1Object = sheet11[cell1];
      var cell1Value = cell1Object['v'];
      console.log(cell1 + " \t" + cell1Value);

      // machineGroupId
      var cell2 = xls_utils.encode_cell({c:2, r:i});
      var cell2Object = sheet11[cell2];
      var cell2Value = cell2Object['v'];
      console.log(cell2 + " \t" + cell2Value);

      // costCenterId
      var cell3 = xls_utils.encode_cell({c:3, r:i});
      var cell3Object = sheet11[cell3];
      var cell3Value = cell3Object['v'];
      console.log(cell3 + " \t" + cell3Value);

      // cellId
      var cell4 = xls_utils.encode_cell({c:4, r:i});
      var cell4Object = sheet11[cell4];
      var cell4Value = cell4Object['v'];
      console.log(cell4 + " \t" + cell4Value);

      // capacity
      var cell5 = xls_utils.encode_cell({c:5, r:i});
      var cell5Object = sheet11[cell5];
      var cell5Value = cell5Object['v'];
      console.log(cell5 + " \t" + cell5Value);

      //machineWeight
      var cell6 = xls_utils.encode_cell({c:6, r:i});
      var cell6Object = sheet11[cell6];
      var cell6Value = cell6Object['v'];
      console.log(cell6 + " \t" + cell6Value);

      // frequencey
      var cell7 = xls_utils.encode_cell({c:7, r:i});
      var cell7Object = sheet11[cell7];
      var cell7Value = cell7Object['v'];
      console.log(cell7 + " \t" + cell7Value);

      // machine operation
      var cell8 = xls_utils.encode_cell({c:8, r:i});
      var cell8Object = sheet11[cell8];
      var cell8Value = cell8Object['v'];
      console.log(cell8 + " \t" + cell8Value);

      // process name
      var cell9 = xls_utils.encode_cell({c:9, r:i});
      var cell9Object = sheet11[cell9];
      var cell9Value = cell9Object['v'];
      console.log(cell9 + " \t" + cell9Value);

      json11.push({
        machineName: cell0value,
        machineTypeId: null,
        machineGroupId: null,
        costCenterId: null,
        capacity: cell5Value,
        cellId: null,
        machineWeight: cell6Value,
        status: 1,
        maintenanceStatus: 'Available',
        createdBy: 1,
        updatedBy: 1,
        frequencyInDays: 0,

       });
    }
    var machine details = await CostCenter.createEach(json11);*/

    // Read Raw Material
    /* var filepath13 = './documents/templates/bulk-upload/13-BulkUploadRawMaterialTemplate.xlsx';
    var workbook13 = XLSX.readFile(filepath13);
    var sheet13 = workbook13.Sheets[workbook13.SheetNames[0]];
    var num_rows13 = xls_utils.decode_range(sheet13['!ref']).e.r;
    var json13 = [];
    var materialNumbers = [];
    for(var i = 1, l = num_rows13; i <= l; i++){

      var rmNumber = xls_utils.encode_cell({c:0, r:i});
      var rmNumberValue = sheet13[rmNumber];
      var rmNumberResult = 0;

      if (rmNumberValue != undefined) {
        rmNumberResult = rmNumberValue['v'];
      }  else {
        continue;
      }

      var rmDesc = xls_utils.encode_cell({c:1, r:i});
      var rmDescValue = sheet13[rmDesc];
      var rmDescResult = "";

      if (rmDescValue != undefined) {
        rmDescResult = rmDescValue['v'];
      }  else {
        continue;
      }

      var rmType = xls_utils.encode_cell({c:2, r:i});
      var rmTypeValue = sheet13[rmType];
      var rmTypeResult = "";

      if (rmTypeValue != undefined) {
        rmTypeResult = rmTypeValue['v'];
      } else {
        continue;
      }

      console.log(i + " rmTypeResult: " + rmTypeResult);

      await MaterialType.find({name: rmTypeResult}).then( async (type) => {
        var typeIdentifer = null;
        if (type.length > 0) {
          typeIdentifer = type[0]['id'];
        }

        console.log(i + " typeIdentifer: " + typeIdentifer);
        if (materialNumbers.indexOf(rmNumberResult) > -1) {
          console.log("duplicateNumber: ", rmNumberResult);
        } else {
          json13.push({
            rawMaterialNumber: Number(rmNumberResult),
            description: rmDescResult,
            materialTypeId:typeIdentifer,
            rmCreateDate:Date.now(),
            rmUpdateDate: Date.now(),
            status: 1,
            createdBy: 1,
            updatedBy: 1,
          });
          materialNumbers.push(rmNumberResult);
        }
      });
    }
    console.log("json13: ", json13);
    var materialList = await RawMaterial.createEach(json13);*/


    // Read Access Level
    var filepath17 = './documents/templates/bulk-upload/17-BulkUploadRoleAccessLevelRelation.xlsx';
    var workbook17 = XLSX.readFile(filepath17);
    var sheet17 = workbook17.Sheets[workbook17.SheetNames[0]];
    var num_rows17 = xls_utils.decode_range(sheet17['!ref']).e.r;
    var json17 = [];
    for(var i = 1, l = num_rows17; i <= l; i++){

      var cell1 = xls_utils.encode_cell({c:0, r:i});
      var cell1Object = sheet17[cell1];
      var cell1Value = cell1Object['v'];

      var cell2 = xls_utils.encode_cell({c:1, r:i});
      var cell2Object = sheet17[cell2];
      var cell2Value = cell2Object['v'];

      var cell3 = xls_utils.encode_cell({c:2, r:i});
      var cell3Object = sheet17[cell3];
      var cell3Value = cell3Object['v'];

      await Role.find({roleName: cell1Value}).then( async (roles) => {
        var roleIdentifer = null;
        if (roles.length > 0) {
          roleIdentifer = roles[0]['id'];
        }

        console.log("User Role: " + roleIdentifer + " " + cell1Value);

        await AccessLevel.find({uri: cell2Value, httpMethod: cell3Value}).then( async (acessLevels) => {

          var accessLevelId = null;
          if (acessLevels.length > 0) {
            accessLevelId = acessLevels[0]['id'];
          }

          console.log("User Access Level: " + accessLevelId + " " + cell2Value + " " + cell3 + " " + cell3Value);
          json17.push({
            roleId: roleIdentifer,
            accessId: accessLevelId,
          });
        });

      });
    }
    var roleAccessRelation = await RoleAccessRelation.createEach(json17);

    // shift
    var filepath18 = './documents/templates/bulk-upload/18-BulkUploadShift.xlsx';
    var workbook18 = XLSX.readFile(filepath18);
    var sheet18 = workbook18.Sheets[workbook18.SheetNames[0]];
    var num_rows18 = xls_utils.decode_range(sheet18['!ref']).e.r;
    var json18 = [];
    for(var i = 1, l = num_rows18; i <= l; i++){

      // shift
      // var cell0 = xls_utils.encode_cell({c:0, r:i});
      // var cell0Object = sheet10[cell0Object];
      // var cell0Value = cell0Value['v'];
      // console.log(cell0Object + " \t" + result);

      var shift = fetchValueFromExcel(xls_utils, sheet18, 0, i);
      var startTimeInSeconds = fetchValueFromExcel(xls_utils, sheet18, 1, i);
      var endTimeInSeconds = fetchValueFromExcel(xls_utils, sheet18, 2, i);
      var teaBreakStartInSeconds = fetchValueFromExcel(xls_utils, sheet18, 3, i);
      var teaBreakEndInSeconds = fetchValueFromExcel(xls_utils, sheet18, 4, i);
      var lunchBreakStartInSeconds = fetchValueFromExcel(xls_utils, sheet18, 5, i);
      var lunchBreakEndInSeconds = fetchValueFromExcel(xls_utils, sheet18, 6, i);
      var cell = fetchValueFromExcel(xls_utils, sheet18, 7, i);

      await Cell.find({name: cell}).then( async (items) => {
        var id = null;
        if (items.length > 0) {
          id = items[0]['id'];
        }

        json18.push({
          name: shift,
          startTimeInSeconds: startTimeInSeconds,
          endTimeInSeconds: endTimeInSeconds,
          teaBreakStartInSeconds: teaBreakStartInSeconds,
          teaBreakEndInSeconds: teaBreakEndInSeconds,
          lunchBreakStartInSeconds: lunchBreakStartInSeconds,
          lunchBreakEndInSeconds: lunchBreakEndInSeconds,
          cell: id,
        });
      });
    }
    var shifts = await Shift.createEach(json18);


    return res.status(200).send("Seed Database");
  }
};

function fetchValueFromExcel(utils, sheet, column, row) {

  if (utils == undefined || sheet == undefined || column == undefined || row == undefined) {
    return undefined;
  }

  // console.log("Utils: ", utils);
  // console.log("Sheet: ", sheet);
  // console.log("column: ", column);
  // console.log("row: ", row);

  var cell1Value = undefined;
  var cell1 = utils.encode_cell({c:column, r:row});
  if (cell1 != undefined) {
    var cell1Object = sheet[cell1];
    cell1Value = cell1Object['v'];
    console.log(cell1 + " \t" + cell1Value);;

  }
  return cell1Value;
}
