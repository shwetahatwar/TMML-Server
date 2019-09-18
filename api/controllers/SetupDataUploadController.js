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
          department: depId,
          barcodeSerial:employeeResult,
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
    var filepath11 = './documents/templates/bulk-upload/11-BulkUploadMachineDetails.xlsx';
    var workbook11 = XLSX.readFile(filepath11);
    var sheet11 = workbook11.Sheets[workbook11.SheetNames[0]];
    var num_rows11 = xls_utils.decode_range(sheet11['!ref']).e.r;
    var json11 = [];
    var machineLocation = [];
    for(var i = 1, l = num_rows11; i <= l; i++) {
      var counter = 0;
      if(i.toString.length == 1){
        counter = "00" + i;
      }
      else if(i.toString.length == 2){
        counter = "0" + i;
      }
      var barcodeSerial = "MA" + counter;

      var machineName = fetchValueFromExcel(xls_utils, sheet11, 0, i);
      var machinetype = fetchValueFromExcel(xls_utils, sheet11, 1, i);
      var machineGroup1 = fetchValueFromExcel(xls_utils, sheet11, 2, i);
      var machinetype1 = fetchValueFromExcel(xls_utils, sheet11, 3, i);
      var machineGroup2 = fetchValueFromExcel(xls_utils, sheet11, 4, i);
      var machinetype2 = fetchValueFromExcel(xls_utils, sheet11, 5, i);
      var machineGroup3 = fetchValueFromExcel(xls_utils, sheet11, 6, i);
      var machinetype3 = fetchValueFromExcel(xls_utils, sheet11, 7, i);
      var machineGroup4 = fetchValueFromExcel(xls_utils, sheet11, 8, i);
      var machinetype4 = fetchValueFromExcel(xls_utils, sheet11, 9, i);
      var machineGroup5 = fetchValueFromExcel(xls_utils, sheet11, 10, i);
      var machinetype5 = fetchValueFromExcel(xls_utils, sheet11, 11, i);
      var machineGroup6 = fetchValueFromExcel(xls_utils, sheet11, 12, i);
      var machinetype6 = fetchValueFromExcel(xls_utils, sheet11, 13, i);
      var machineGroup7 = fetchValueFromExcel(xls_utils, sheet11, 14, i);
      var machinetype7 = fetchValueFromExcel(xls_utils, sheet11, 15, i);
      var machineGroup8 = fetchValueFromExcel(xls_utils, sheet11, 16, i);
      var machinetype8 = fetchValueFromExcel(xls_utils, sheet11, 17, i);
      var costCenter = fetchValueFromExcel(xls_utils, sheet11, 18, i);
      var cell = fetchValueFromExcel(xls_utils, sheet11, 19, i);
      var capacity = fetchValueFromExcel(xls_utils, sheet11, 20, i);
      var machineweight = fetchValueFromExcel(xls_utils, sheet11, 21, i);
      var maintenanceFrequency = fetchValueFromExcel(xls_utils, sheet11, 22, i);
      var machineOperation = fetchValueFromExcel(xls_utils, sheet11, 23, i);
      var processName = fetchValueFromExcel(xls_utils, sheet11, 24, i);

      var cells = await Cell.find({name: cell});
      var cellId = null;
      if (cells.length > 0) {
        cellId = cells[0].id;
      }

      var group = [];
      var machinegroups1 = await MachineGroup.find({name: machineGroup1});
      var machinegroups2 = await MachineGroup.find({name: machineGroup2});
      var machinegroups3 = await MachineGroup.find({name: machineGroup3});
      var machinegroups4 = await MachineGroup.find({name: machineGroup4});
      var machinegroups5 = await MachineGroup.find({name: machineGroup5});
      var machinegroups6 = await MachineGroup.find({name: machineGroup6});
      var machinegroups7 = await MachineGroup.find({name: machineGroup7});
      var machinegroups8 = await MachineGroup.find({name: machineGroup8});

      if (machinegroups1.length > 0) {
        group.push(machinegroups1[0].id);
      }
      if (machinegroups2.length > 0) {
        group.push(machinegroups2[0].id);
      }
      if (machinegroups3.length > 0) {
        group.push(machinegroups3[0].id);
      }
      if (machinegroups4.length > 0) {
        group.push(machinegroups4[0].id);
      }
      if (machinegroups5.length > 0) {
        group.push(machinegroups5[0].id);
      }
      if (machinegroups6.length > 0) {
        group.push(machinegroups6[0].id);
      }
      if (machinegroups7.length > 0) {
        group.push(machinegroups7[0].id);
      }
      if (machinegroups8.length > 0) {
        group.push(machinegroups8[0].id);
      }

      var joinedgroup = group.join(',');
      console.log(joinedgroup);

      // var newBarcodeSerial;
      // var getMachine = await Machine.find()
      // .sort('id DESC')
      // .limit(1);

      // var getMachine = await Machine.find()
      // .sort('id DESC')
      // .limit(1);
      // var barcodeSerial;
      // if(getMachine[0]!=null && getMachine[0]!=undefined){
      //   var getBarcode = getMachine[0]["barcodeSerial"];
      //   var counter = getBarcode.substring(2,5);
      //   counter = parseInt(counter) + 1;
      //   if(counter.length == 1){
      //     counter = "00" + counter
      //   }else if(counter.length == 2){
      //     counter = "0" + counter
      //   }else{
      //     counter = counter;
      //   }
      //   barcodeSerial = "MA"+counter;
      // }
      // else{
      //   barcodeSerial = "MA001"
      // }



      json11.push({
        machineName: machineName,
        machineGroupId: group,
        costCenterId: null,
        capacity: capacity,
        cellId: cellId,
        machineWeight: machineweight,
        status: 1,
        maintenanceStatus: 'Available',
        operationType: machineOperation,
        createdBy: 1,
        updatedBy: 1,
        frequencyInDays: 0,
        barcodeSerial:barcodeSerial,
       });

      machineLocation.push({name:machineName,locationType:'Machine',barcodeSerial:barcodeSerial});
    }
    var machines = await Machine.createEach(json11);
    var machineLocations = await Location.createEach(machineLocation);

    // Read Raw Material
     var filepath13 = './documents/templates/bulk-upload/13-BulkUploadRawMaterialTemplate.xlsx';
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
    var materialList = await RawMaterial.createEach(json13);


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

    //Part Number
    var filepath19 = './documents/templates/bulk-upload/14-BulkUploadPartNumberTemplate-s1.xlsx';
    var workbook19 = XLSX.readFile(filepath19);
    var sheet19 = workbook19.Sheets[workbook19.SheetNames[0]];
    var num_rows19 = xls_utils.decode_range(sheet19['!ref']).e.r;
    var json19 = [];
    partNumberArray = [];
    for(var i = 1, l = num_rows19; i <= l; i++){
      var partNumber = fetchValueFromExcel(xls_utils, sheet19, 0, i);
      var partDescription = fetchValueFromExcel(xls_utils, sheet19, 1, i);
      var sapLocation = fetchValueFromExcel(xls_utils, sheet19, 2, i);
      var materialType = fetchValueFromExcel(xls_utils, sheet19, 3, i);
      var unitOfMeasurement = fetchValueFromExcel(xls_utils, sheet19, 4, i);
      var rawMaterialNumber = fetchValueFromExcel(xls_utils, sheet19, 5, i);
      var rawMaterialQuantity = fetchValueFromExcel(xls_utils, sheet19, 6, i);
      var rawMaterialUOM = fetchValueFromExcel(xls_utils, sheet19, 7, i);
      var materailGroup = fetchValueFromExcel(xls_utils, sheet19, 8, i);
      var status = fetchValueFromExcel(xls_utils, sheet19, 9, i);

      var locationId = await Location.find({name:sapLocation});
      if(locationId!=null&&locationId!=undefined){

      }
      else{
        locationId=null;
      }
      // console.log("Line 650",rawMaterialNumber);
      var rawMaterialNumberId = await RawMaterial.find({rawMaterialNumber:rawMaterialNumber});
      var checkPartNumber = partNumberArray.includes(partNumber);
      if(!checkPartNumber){
        partNumberArray.push(partNumber);

        if(rawMaterialNumberId[0]!=null&&rawMaterialNumberId[0]!=undefined){
          json19.push({
            partNumber: partNumber,
            description: partDescription,
            manPower: 0,
            SMH: 0,
            rawMaterialId: rawMaterialNumberId[0]["id"],
            partCreationDate: 0,
            partChangeDate: 0,
            partStatus:'N',
            status:status,
            uom:unitOfMeasurement,
            materialGroup:materailGroup,
            rawMaterialQuantity:rawMaterialQuantity
          });
        }
      }
    }
    var parts = await PartNumber.createEach(json19);

    //Part Number ProcessSequence
    var filepath20 = './documents/templates/bulk-upload/14-BulkUploadPartNumberTemplate-s2.xlsx';
    var workbook20 = XLSX.readFile(filepath20);
    var sheet20 = workbook20.Sheets[workbook20.SheetNames[0]];
    var num_rows20 = xls_utils.decode_range(sheet20['!ref']).e.r;
    var json20 = [];
    // partNumberArray = [];
    for(var i = 1, l = num_rows20; i <= l; i++){
      var partNumber = fetchValueFromExcel(xls_utils, sheet20, 0, i);
      var manPower = fetchValueFromExcel(xls_utils, sheet20, 3, i);
      var SMH = fetchValueFromExcel(xls_utils, sheet20, 4, i);
      var j=1;

      await PartNumber.update({
        partNumber:partNumber
      })
      .set({
        manPower:manPower,
        SMH:SMH
      });
      var newPartNumberId = await PartNumber.find({
        partNumber:partNumber
      });
      if(newPartNumberId[0]!=null&&newPartNumberId[0]!=undefined){

        var processName1 = fetchValueFromExcel(xls_utils, sheet20, 5, i);
        var processLoding1 = fetchValueFromExcel(xls_utils, sheet20, 6, i);
        var processprocess1 = fetchValueFromExcel(xls_utils, sheet20, 7, i);
        var processunloading1 = fetchValueFromExcel(xls_utils, sheet20, 8, i);
        var processcycle1 = fetchValueFromExcel(xls_utils, sheet20, 9, i);

        await processCreate(processName1,newPartNumberId[0]["id"],j,processLoding1,processprocess1,processunloading1,processcycle1);

        var processName2 = fetchValueFromExcel(xls_utils, sheet20, 10, i);
        var processLoding2 = fetchValueFromExcel(xls_utils, sheet20, 11, i);
        var processprocess2 = fetchValueFromExcel(xls_utils, sheet20, 12, i);
        var processunloading2 = fetchValueFromExcel(xls_utils, sheet20, 13, i);
        var processcycle2 = fetchValueFromExcel(xls_utils, sheet20, 14, i);
        j++;

        await processCreate(processName2,newPartNumberId[0]["id"],j,processLoding2,processprocess2,processunloading2,processcycle2);

        var processName3 = fetchValueFromExcel(xls_utils, sheet20, 15, i);
        var processLoding3 = fetchValueFromExcel(xls_utils, sheet20, 16, i);
        var processprocess3 = fetchValueFromExcel(xls_utils, sheet20, 17, i);
        var processunloading3 = fetchValueFromExcel(xls_utils, sheet20, 18, i);
        var processcycle3 = fetchValueFromExcel(xls_utils, sheet20, 19, i);
        j++;

        await processCreate(processName3,newPartNumberId[0]["id"],j,processLoding3,processprocess3,processunloading3,processcycle3);

        var processName4 = fetchValueFromExcel(xls_utils, sheet20, 20, i);
        var processLoding4 = fetchValueFromExcel(xls_utils, sheet20, 21, i);
        var processprocess4 = fetchValueFromExcel(xls_utils, sheet20, 22, i);
        var processunloading4 = fetchValueFromExcel(xls_utils, sheet20, 23, i);
        var processcycle4 = fetchValueFromExcel(xls_utils, sheet20, 24, i);
        j++;

        await processCreate(processName4,newPartNumberId[0]["id"],j,processLoding4,processprocess4,processunloading4,processcycle4);

        var processName5 = fetchValueFromExcel(xls_utils, sheet20, 25, i);
        var processLoding5 = fetchValueFromExcel(xls_utils, sheet20, 26, i);
        var processprocess5 = fetchValueFromExcel(xls_utils, sheet20, 27, i);
        var processunloading5 = fetchValueFromExcel(xls_utils, sheet20, 28, i);
        var processcycle5 = fetchValueFromExcel(xls_utils, sheet20, 29, i);
        j++;

        await processCreate(processName5,newPartNumberId[0]["id"],j,processLoding5,processprocess5,processunloading5,processcycle5);

        var processName6 = fetchValueFromExcel(xls_utils, sheet20, 30, i);
        var processLoding6 = fetchValueFromExcel(xls_utils, sheet20, 31, i);
        var processprocess6 = fetchValueFromExcel(xls_utils, sheet20, 32, i);
        var processunloading6 = fetchValueFromExcel(xls_utils, sheet20, 33, i);
        var processcycle6 = fetchValueFromExcel(xls_utils, sheet20, 34, i);
        j++;

        await processCreate(processName6,newPartNumberId[0]["id"],j,processLoding6,processprocess6,processunloading6,processcycle6);

        var processName7 = fetchValueFromExcel(xls_utils, sheet20, 35, i);
        var processLoding7 = fetchValueFromExcel(xls_utils, sheet20, 36, i);
        var processprocess7 = fetchValueFromExcel(xls_utils, sheet20, 37, i);
        var processunloading7 = fetchValueFromExcel(xls_utils, sheet20, 38, i);
        var processcycle7 = fetchValueFromExcel(xls_utils, sheet20, 39, i);
        j++;

        await processCreate(processName7,newPartNumberId[0]["id"],j,processLoding7,processprocess7,processunloading7,processcycle7);

        var processName8 = fetchValueFromExcel(xls_utils, sheet20, 40, i);
        var processLoding8 = fetchValueFromExcel(xls_utils, sheet20, 41, i);
        var processprocess8 = fetchValueFromExcel(xls_utils, sheet20, 42, i);
        var processunloading8 = fetchValueFromExcel(xls_utils, sheet20, 43, i);
        var processcycle8 = fetchValueFromExcel(xls_utils, sheet20, 44, i);
        j++;

        await processCreate(processName8,newPartNumberId[0]["id"],j,processLoding8,processprocess8,processunloading8,processcycle8);

        var processName9 = fetchValueFromExcel(xls_utils, sheet20, 45, i);
        var processLoding9 = fetchValueFromExcel(xls_utils, sheet20, 46, i);
        var processprocess9 = fetchValueFromExcel(xls_utils, sheet20, 47, i);
        var processunloading9 = fetchValueFromExcel(xls_utils, sheet20, 48, i);
        var processcycle9 = fetchValueFromExcel(xls_utils, sheet20, 49, i);
        j++;

        await processCreate(processName9,newPartNumberId[0]["id"],j,processLoding9,processprocess9,processunloading9,processcycle9);

        var processName10 = fetchValueFromExcel(xls_utils, sheet20, 50, i);
        var processLoding10 = fetchValueFromExcel(xls_utils, sheet20, 51, i);
        var processprocess10 = fetchValueFromExcel(xls_utils, sheet20, 52, i);
        var processunloading10 = fetchValueFromExcel(xls_utils, sheet20, 53, i);
        var processcycle10 = fetchValueFromExcel(xls_utils, sheet20, 54, i);
        j++;

        await processCreate(processName10,newPartNumberId[0]["id"],j,processLoding10,processprocess10,processunloading10,processcycle10);
      }
    }



    await MailConfig.create({
      mailSubject:'%MACHINE% status changed to %STATUS% by %OPERATOR%',
      mailBody:'Dear %NAME%'+
'%MACHINE% of %CELL% status changed to %STATUS% by %OPERATOR%'+
'%PART%'+
'Remarks: %Remarks%'+
'Regards'+
'TMML Machine Shop Solution System',
      senderUsername:'Santosh Adaki',
      maintenanceStatus:'NA'
    });

    return res.status(200).send("Seed Database");
  },
  updatePartNumberLocation:async function(req,res){
    var filepath10 = './documents/templates/bulk-upload/14-BulkUploadPartNumberTemplate-s1.xlsx';
    var workbook10 = XLSX.readFile(filepath10);
    var sheet10 = workbook10.Sheets[workbook10.SheetNames[0]];
    var num_rows10 = xls_utils.decode_range(sheet10['!ref']).e.r;
    var json10 = [];
    for(var i = 1, l = num_rows10; i <= l; i++){
      var sapLocation = fetchValueFromExcel(xls_utils, sheet10, 2, i);
      var excelPartNumber = fetchValueFromExcel(xls_utils, sheet10, 0, i);
      var findLocation = await Location.find({
        name: sapLocation
      });
      if(findLocation[0] != null && findLocation[0] != undefined){
        var findPartNumber = await PartNumber.update({
          partNumber: excelPartNumber
        })
        .set({
          kanbanLocation: findLocation[0]["id"]
        }).fetch();
        console.log(findPartNumber);
      }
      else{
        var newPartNumberLocation = await Location.create({
          name: sapLocation,
          barcodeSerial: "",
          locationType: "Kanban Location"
        }).fetch();
        var findPartNumber = await PartNumber.update({
          partNumber: excelPartNumber
        })
        .set({
          kanbanLocation: newPartNumberLocation["id"]
        }).fetch();
        console.log(findPartNumber);
      }
    }
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
    if (cell1Object != undefined) {
      cell1Value = cell1Object['v'];
      console.log(cell1 + " \t" + cell1Value);;
    }

  }
  return cell1Value;
}

async function processCreate(processName,newPartNumberId,count,processLoding,processprocess,processunloading,processcycle){
  console.log("In Process Create");
  if(processName != null && processName != undefined){
      var machineGroupId = await MachineGroup.find({
        name:processName
      });
      if(machineGroupId[0] != null && machineGroupId[0] != undefined){
        var newProcessSequenceId = await ProcessSequence.create({
          partId:newPartNumberId,
          sequenceNumber:count,
          loadingTime: processLoding,
          processTime:processprocess,
          unloadingTime:processunloading,
          cycleTime:processcycle,
          machineGroupId:machineGroupId[0]["id"],
          isGroup:true
        })
        .fetch()
        .catch(error=>{console.log(error)});
        console.log(machineGroupId);

        var machineGroupNew = await Machine.find()
        .populate('machineGroupId');
        var machineGroupMachines = [];
        for(var i=0;i<machineGroupNew.length;i++){
          if(machineGroupId[0]["id"] == machineGroupNew[i]["machineGroupId"][0]["id"]){
            machineGroupMachines.push(machineGroupNew[i]["machineName"]);
          }
        }
        // var machineGroupMachines = await Machine.find({where:{machineGroupId:machineGroupId[0]["id"]}});
        console.log(machineGroupMachines);
        for(var machineCount = 0;machineCount<machineGroupMachines.length;machineCount++){
          var machineIdValue;
          var newMachineId = await Machine.find({
            machineName:machineGroupMachines[machineCount]["machineName"]
          });
          await ProcessSequenceMachineRelation.create({
            processSequenceId:newProcessSequenceId["id"],
            machineId:newMachineId[0]["id"]
          })
          .catch((error)=>{console.log(error)});
        }
      }
    }
}
