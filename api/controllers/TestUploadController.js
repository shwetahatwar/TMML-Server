var XLSX = require('xlsx'),
    xls_utils = XLSX.utils;
module.exports={

	test : async function(req,res){
		var workbook = XLSX.readFile('C:\\Users\\karan\\Desktop\\BRiOT Software\\Tata Marcopolo Tracking software/Cells.xlsx');
		var sheet = workbook.Sheets[workbook.SheetNames[0]];
		var num_rows = xls_utils.decode_range(sheet['!ref']).e.r;
		for(var i = 1, l = num_rows; i <= l; i++){
    	// Get cell in {c}olumn 2 (0=1 like arrays) and {r}ow: i
    	var cell = xls_utils.encode_cell({c:0, r:i});
    	var value = sheet[cell];
    	var createdBy = xls_utils.encode_cell({c:1, r:i});
    	var createdByValue = sheet[createdBy];
    	var updatedBy = xls_utils.encode_cell({c:2, r:i});
    	var updatedByValue = sheet[updatedBy];
    	var createdByIdValues;
    	var updatedByIdValues;
    	await User.findOne({
    		where:{'username':createdByValue['v']}
    	})
    	.then((createdById)=>{createdByIdValues = createdById["id"]});
    	await User.findOne({
    		where:{'username':updatedByValue['v']}
    	})
    	.then((updatedById)=>{updatedByIdValues = updatedById["id"]});
    	await Cell.create({name:value['v'],createdBy:createdByIdValues,updatedBy:updatedByIdValues});
		}
		return res.ok();
	}
};