var XLSX = require('xlsx'),
xls_utils = XLSX.utils;

module.exports = {

	updateParts: async function(req, res) {
		var filepath19 = './documents/templates/Part-Number-Data.xlsx';
		var workbook19 = XLSX.readFile(filepath19);
		var sheet19 = workbook19.Sheets[workbook19.SheetNames[0]];
		var num_rows19 = xls_utils.decode_range(sheet19['!ref']).e.r;
		var json19 = [];
		partNumberArray = [];
		for(var i = 1, l = num_rows19; i <= l; i++){
			var partNumber = fetchValueFromExcel(xls_utils, sheet19, 0, i);
			var partDescription = fetchValueFromExcel(xls_utils, sheet19, 1, i);      
			var unitOfMeasurement = fetchValueFromExcel(xls_utils, sheet19, 2, i);
			var partCreationDate = fetchValueFromExcel(xls_utils, sheet19, 3, i);      
			var partChangeDate = fetchValueFromExcel(xls_utils, sheet19, 4, i);
			var materailGroup = fetchValueFromExcel(xls_utils, sheet19, 5, i);
			var rawMaterialNumber = fetchValueFromExcel(xls_utils, sheet19, 7, i);      
			var rawMaterialDescription = fetchValueFromExcel(xls_utils, sheet19, 8, i);
			var sapLocation = fetchValueFromExcel(xls_utils, sheet19, 15, i);
			var prodLoc = fetchValueFromExcel(xls_utils, sheet19, 13, i);
			var storageLoc = fetchValueFromExcel(xls_utils, sheet19, 14, i);      
			var rmUOM = fetchValueFromExcel(xls_utils, sheet19, 9, i);
			if(partNumber){
				var locationId=null;
				if(sapLocation){
					var location = await Location.find({
						name:sapLocation
					});
					if(location[0] != null && location[0] != undefined){
						locationId = location[0]["id"]
					}
					else{
						var newLocation = await Location.create({
							name:sapLocation,
							barcodeSerial:Date.now(),
							locationType:'Kanban Location'
						}).fetch();
						locationId = newLocation["id"]
					}
				}

				var rawMaterialNumberId = await RawMaterial.find({rawMaterialNumber:rawMaterialNumber});
				var newRawMaterialId;
				if(rawMaterialNumberId[0] != null && rawMaterialNumberId[0] != undefined){
					newRawMaterialId = rawMaterialNumberId[0]["id"];
					var newRawMaterial = await RawMaterial.update({
						rawMaterialNumber : rawMaterialNumber
					}).set({
						description: rawMaterialDescription
					});
				}
				else{
					var newRawMaterialId = await RawMaterial.create({
						rawMaterialNumber: rawMaterialNumber,
						description: rawMaterialDescription,
						uom: rmUOM,
						remarks: "",
						status:1,
						materialTypeId:1
					})
					.fetch();
					newRawMaterialId = newRawMaterialId["id"];
				}
				var partNumberData = await PartNumber.find({partNumber:partNumber});
				if(partNumberData[0] != null && partNumberData[0] != undefined){
					var updatedPart = await PartNumber.update({
						partNumber : partNumber
					}).set({
						description: partDescription,
						rawMaterialId: newRawMaterialId,
						partCreationDate: partCreationDate,
						partChangeDate: partChangeDate,
						uom:unitOfMeasurement,
						rackLoc :storageLoc,
						prodLoc :prodLoc,
						kanbanLocation : locationId,
						materialGroup:materailGroup
					});
				}
			}
		}
		res.send("updated");
		
	}
};

function fetchValueFromExcel(utils, sheet, column, row) {

	if (utils == undefined || sheet == undefined || column == undefined || row == undefined) {
		return undefined;
	}

	var cell1Value = undefined;
	var cell1 = utils.encode_cell({c:column, r:row});
	if (cell1 != undefined) {
		var cell1Object = sheet[cell1];
		if (cell1Object != undefined) {
			cell1Value = cell1Object['v'];
		}

	}
	return cell1Value;
}