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
    var filepath2 = './documents/templates/bulk-upload/04-BulkUploadTrolleyType.xlsx';
    var workbook2 = XLSX.readFile(filepath2);
    var sheet2 = workbook2.Sheets[workbook2.SheetNames[0]];
    var num_rows2 = xls_utils.decode_range(sheet2['!ref']).e.r;
    var json2 = [];
    for(var i = 1, l = num_rows2; i <= l; i++){
      var name = xls_utils.encode_cell({c:0, r:i});
      var value = sheet2[name];
      var result = value['v'];
      console.log(name + " \t" + result);
      json2.push({name: result});
    }
    var trolleyTypes = await TrolleyType.createEach(json2).then(

    );

    // Read Materialtype
    var filepath3 = './documents/templates/bulk-upload/05-BulkUploadRawMaterialType.xlsx';
    var workbook3 = XLSX.readFile(filepath3);
    var sheet3 = workbook3.Sheets[workbook3.SheetNames[0]];
    var num_rows3 = xls_utils.decode_range(sheet3['!ref']).e.r;
    var json3 = [];
    for(var i = 1, l = num_rows3; i <= l; i++){
      var name = xls_utils.encode_cell({c:0, r:i});
      var value = sheet3[name];
      var result = value['v'];
      console.log(name + " \t" + result);
      json3.push({name: result});
    }
    var materialTypes = await MaterialType.createEach(json3);

    // Read Cell
    var filepath4 = './documents/templates/bulk-upload/08-BulkUploadMachineCell.xlsx';
    var workbook4 = XLSX.readFile(filepath4);
    var sheet4 = workbook4.Sheets[workbook4.SheetNames[0]];
    var num_rows4 = xls_utils.decode_range(sheet4['!ref']).e.r;
    var json4 = [];
    for(var i = 1, l = num_rows4; i <= l; i++){
      var name = xls_utils.encode_cell({c:0, r:i});
      var value = sheet4[name];
      var result = value['v'];
      console.log(name + " \t" + result);
      json4.push({name: result});
    }
    var cells = await Cell.createEach(json4);

    // Costcenter
    var filepath5 = './documents/templates/bulk-upload/10-BulkUploadCostCenter.xlsx';
    var workbook5 = XLSX.readFile(filepath5);
    var sheet5 = workbook5.Sheets[workbook5.SheetNames[0]];
    var num_rows5 = xls_utils.decode_range(sheet5['!ref']).e.r;
    var json5 = [];
    for(var i = 1, l = num_rows5; i <= l; i++){
      var name = xls_utils.encode_cell({c:0, r:i});
      var value = sheet5[name];
      var result = value['v'];
      console.log(name + " \t" + result);
      json4.push({name: result});
    }
    var cells = await Cell.createEach(json5);

    return res.status(200).send("Seed Database");
  }
};
