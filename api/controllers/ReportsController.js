var nodemailer = require ('nodemailer');
var json2xls = require('json2xls');
var fs = require('fs');

module.exports = {

	shiftWiseReport :async function(req,res){
		var selfSignedConfig = {
			host: '128.9.24.24',
			port: 25

		};
		var transporter = nodemailer.createTransport(selfSignedConfig);
		var dateTimeFormat;
		var updatedAtStart=0;
		var updatedAtEnd=0;
		var d = new Date();
		var curr_date = d.getDate();
		if(curr_date.toString().length == 1){
			curr_date = "0" + curr_date
		}
		var curr_month = parseInt(d.getMonth()) + 1;
		curr_month = ""+curr_month;
		if(curr_month.toString().length == 1){
			curr_month = "0" + curr_month
		}
		var curr_year = d.getFullYear();
		curr_year = curr_year.toString();
		curr_year = curr_year.substring(2,4);
		dateTimeFormat = curr_date + "-" + curr_month + "-" + curr_year;
		var Shift= "A";
		var curr_Time = d.toLocaleTimeString();
		var checkShift = curr_Time.substring(0,4);
		if(checkShift == "2:35"){
			Shift ="A";
		}
		else if(checkShift == "11:10"){
			Shift = "B";
		}
		else if(checkShift == "7:10"){
			Shift = "C";
		}
		else if(checkShift == "12:20"){
			Shift = "D";
		}

		if(Shift =="A")
		{
			var startTime =  (parseInt(d.getMonth()) + 1) +"-"+ d.getDate() +"-"+ d.getFullYear()+ " " +"06:00:00";
			var dt = new Date(startTime);
			updatedAtStart=dt.setSeconds( dt.getSeconds());
			var EndTime =  (parseInt(d.getMonth()) + 1) +"-"+ d.getDate() +"-"+ d.getFullYear()+ " " +"14:30:00";
			dt = new Date(EndTime);
			updatedAtEnd=dt.setSeconds( dt.getSeconds());
			console.log("TimeStamps: ",updatedAtStart,updatedAtEnd);
		}
		else if(Shift =="B")
		{
			var startTime =  (parseInt(d.getMonth()) + 1) +"-"+ d.getDate() +"-"+ d.getFullYear()+ " " +"14:30:00";
			var dt = new Date(startTime);
			updatedAtStart=dt.setSeconds( dt.getSeconds());
			var EndTime =  (parseInt(d.getMonth()) + 1) +"-"+ d.getDate() +"-"+ d.getFullYear()+ " " +"23:00:00";
			dt = new Date(EndTime);
			updatedAtEnd=dt.setSeconds( dt.getSeconds());
			console.log("TimeStamps: ",updatedAtStart,updatedAtEnd);
		}
		else if(Shift =="C")
		{
			var startTime =  (parseInt(d.getMonth()) + 1) +"-"+ (parseInt(d.getDate()) - 1) +"-"+ d.getFullYear()+ " " +"23:00:00";
			var dt = new Date(startTime);
			updatedAtStart=dt.setSeconds( dt.getSeconds());
			var EndTime =  (parseInt(d.getMonth()) + 1) +"-"+ d.getDate() +"-"+ d.getFullYear()+ " " +"07:00:00";
			dt = new Date(EndTime);
			updatedAtEnd=dt.setSeconds( dt.getSeconds());
			console.log("TimeStamps: ",updatedAtStart,updatedAtEnd);
		}
		else if(Shift =="D"){
			var startTime =  (parseInt(d.getMonth()) + 1) +"-"+ (parseInt(d.getDate()) - 1) +"-"+ d.getFullYear()+ " " +"00:00:01";
			var dt = new Date(startTime);
			updatedAtStart=dt.setSeconds( dt.getSeconds());
			var EndTime =  (parseInt(d.getMonth()) + 1) +"-"+ (parseInt(d.getDate()) - 1) +"-"+ d.getFullYear()+ " " +"23:59:00";
			dt = new Date(EndTime);
			updatedAtEnd=dt.setSeconds( dt.getSeconds());
			console.log("TimeStamps: ",updatedAtStart,updatedAtEnd);
		}
		console.log("Shift :",Shift);
		var limitCount = 1000;
		var shiftWiseJobCards = [];
		var processSequenceList =""; 
		var jobCards = await JobCard.find({
			where:{ updatedAt :{ '>=':updatedAtStart,'<=':updatedAtEnd}
		},limit:limitCount,sort: [{ id: 'ASC'}]
	}).populate('productionSchedulePartRelationId');

		if(jobCards[0] != null && jobCards[0] != undefined){

			for(var i=0;i<jobCards.length;i++){
				var partId = jobCards[i]["productionSchedulePartRelationId"]["partNumberId"];
				var cellName ="";
				var partNumber =await PartNumber.find({
					id :partId ,
				});

				var part = partNumber[0]["partNumber"];
				var partDesc = partNumber[0]["description"];
				var getProcessSequence = await ProcessSequence.find({
					sequenceNumber:1,
					partId:partId,
					status:1
				});
				if(getProcessSequence[0] != null && getProcessSequence[0] != undefined){
					var getMachineGroupId = await MachineGroup.find({
						id:getProcessSequence[0]["machineGroupId"]
					})
					.populate("machines");
					if(getMachineGroupId[0] != null && getMachineGroupId[0] != undefined && getMachineGroupId[0]["machines"][0] != null && getMachineGroupId[0]["machines"][0] != undefined){
						var getCellName = await Cell.find({
							id:getMachineGroupId[0]["machines"][0]["cellId"]
						});
						var sendCell = {
							cellName: getCellName[0]["name"]
						}
						var partCell=[];
						partCell.push(sendCell);
						// res.send(partCell);
					}
					cellName = partCell[0]["cellName"]
				}

				var nextSequenceNo = 0;
				var count = 0;
				var pendingProcessSequence = "";
				if(jobCards[i]["jobcardStatus"]=="Completed"){
					pendingProcessSequence ="NA";
				}
				else{
					var sequenceNo = await JobProcessSequenceRelation.find({
						jobId: jobCards[i]["id"]
					}).populate('jobId');
					for(var a=0;a<sequenceNo.length;a++){
						if(sequenceNo[a]["processStatus"] != "FinalLocation"){
							console.log("ProcessStatus :",sequenceNo[a]["processStatus"]);
							if(sequenceNo[a]["jobId"]["jobcardStatus"] =="In Progress"){
								console.log("sequenceNo[a]",sequenceNo[a]["jobId"]);
								nextSequenceNo =sequenceNo[a]["sequenceNumber"]+1;
								console.log("nextSequenceNo 1",nextSequenceNo);
								count =sequenceNo.length;
							}
						}
					}
					console.log("nextSequenceNo",nextSequenceNo);
				}
				var processSequence1;
				var processSequence2;
				var processSequence3;
				var processSequence4;
				var processSequence5;
				var jobcard = await JobCard.find({
					barcodeSerial : jobCards[i]["barcodeSerial"]
				});
				console.log(jobcard);
				if(jobcard != null && jobcard != undefined){
					var productionSchedulePartRelation = await ProductionSchedulePartRelation.find({
						id:jobcard[0]["productionSchedulePartRelationId"]
					});
					console.log("Line 87" ,productionSchedulePartRelation);
					if(productionSchedulePartRelation[0] !=null && productionSchedulePartRelation[0] !=undefined){
						var processSequence = await ProcessSequence.find({
							partId: productionSchedulePartRelation[0]["partNumberId"],
							status :1
						});
				if(processSequence[0] != null && processSequence[0] != undefined){
					//console.log(processSequence[0]["machineGroupId"]);
					if(processSequence.length == 1){
						var machineGroup = await MachineGroup.find({
							id:processSequence[0]["machineGroupId"]
						});
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence1 = machineType[0]["name"];
						}
					}
					else if(processSequence.length == 2){
						var machineGroup = await MachineGroup.find({
							id:processSequence[0]["machineGroupId"]
						});
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence1 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[1]["machineGroupId"]
						});
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence2 = machineType[0]["name"];
						}
					}
					else if(processSequence.length == 3){
						var machineGroup = await MachineGroup.find({
							id:processSequence[0]["machineGroupId"]
						});
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence1 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[1]["machineGroupId"]
						});
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence2 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[2]["machineGroupId"]
						});
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence3 = machineType[0]["name"];
						}
					}
					else if(processSequence.length == 4){
						var machineGroup = await MachineGroup.find({
							id:processSequence[0]["machineGroupId"]
						});
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence1 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[1]["machineGroupId"]
						});
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence2 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[2]["machineGroupId"]
						});
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence3 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[3]["machineGroupId"]
						});
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence4 = machineType[0]["name"];
						}
					}
					else if(processSequence.length == 5){
						var machineGroup = await MachineGroup.find({
							id:processSequence[0]["machineGroupId"]
						});
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence1 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[1]["machineGroupId"]
						});
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence2 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[2]["machineGroupId"]
						});
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence3 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[3]["machineGroupId"]
						});
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence4 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[4]["machineGroupId"]
						});
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence5 = machineType[0]["name"];
						}
					}
				}
			}
		}
		var totalProcesses=[];
		var processes = {
			processSequence1:processSequence1,
			processSequence2:processSequence2,
			processSequence3:processSequence3,
			processSequence4:processSequence4,
			processSequence5:processSequence5,
		}
		//console.log(processes);
		totalProcesses.push(processes);
		processSequenceList = totalProcesses[0];
		console.log("totalProcesses[0].length",totalProcesses[0].length);
		if(totalProcesses[0].length ==1){
			pendingProcessSequence ="NA";
		}
		if(jobCards[i]["jobcardStatus"]=="New"){
			pendingProcessSequence = processSequenceList;
		}
		if(nextSequenceNo !=0){
			if (nextSequenceNo == 2)
			{
				if (totalProcesses[0].processSequence2 != null && totalProcesses[0].processSequence2 != "")
				{
					pendingProcessSequence = totalProcesses[0].processSequence2;
				}
				if (totalProcesses[0].processSequence3 != null && totalProcesses[0].processSequence3 != "")
				{
					pendingProcessSequence = totalProcesses[0].processSequence2 + "," + totalProcesses[0].processSequence3;
				}
				if (totalProcesses[0].processSequence4 != null && totalProcesses[0].processSequence4 != "")
				{
					pendingProcessSequence = totalProcesses[0].processSequence2 + "," + totalProcesses[0].processSequence3 + "," + totalProcesses[0].processSequence4;
				}
				if (totalProcesses[0].processSequence5 != null && totalProcesses[0].processSequence5 != "")
				{
					pendingProcessSequence = totalProcesses[0].processSequence2 + "," + totalProcesses[0].processSequence3 + "," + totalProcesses[0].processSequence4 + "," + totalProcesses[0].processSequence5;
				}
			}
			if (nextSequenceNo == 3)
			{
				if (totalProcesses[0].processSequence3 != null && totalProcesses[0].processSequence3 != "")
				{
					pendingProcessSequence = totalProcesses[0].processSequence3;
				}
				if (totalProcesses[0].processSequence4 != null && totalProcesses[0].processSequence4 != "")
				{
					pendingProcessSequence = totalProcesses[0].processSequence3 + "," + totalProcesses[0].processSequence4;
				}
				if (totalProcesses[0].processSequence5 != null && totalProcesses[0].processSequence5 != "")
				{
					pendingProcessSequence = totalProcesses[0].processSequence3 + "," + totalProcesses[0].processSequence4 + "," + totalProcesses[0].processSequence5;
				}
			}
			if (nextSequenceNo == 4)
			{
				if (totalProcesses[0].processSequence4 != null && totalProcesses[0].processSequence4 != "")
				{
					pendingProcessSequence = totalProcesses[0].processSequence4;
				}
				if (totalProcesses[0].processSequence5 != null && totalProcesses[0].processSequence5 != "")
				{
					pendingProcessSequence = totalProcesses[0].processSequence4 + "," + totalProcesses[0].processSequence5;
				}
			}
			if (nextSequenceNo == 5)
			{
				if (totalProcesses[0].processSequence5 != null && totalProcesses[0].processSequence5 != "")
				{
					pendingProcessSequence = totalProcesses[0].processSequence2;
				}
			}
		}
		var createdDate = new Date(jobCards[i]["createdAt"]);
		createdDate = createdDate.toDateString();
		var updatedAt = new Date(jobCards[i]["updatedAt"]);
		updatedAt = updatedAt.toDateString();
		var balanceQty = jobCards[i]["requestedQuantity"] - jobCards[i]["actualQuantity"];
		var Adherence = (jobCards[i]["actualQuantity"] / jobCards[i]["requestedQuantity"]) *100;
		if(Shift=="D"){
			var jobCardsList = {
				'Created Date': createdDate,
				'Estimated Date' : jobCards[i]["estimatedDate"],
				'Completed Date' : updatedAt,
				'Cell No': cellName,
				'Job Card Serial':jobCards[i]["barcodeSerial"],
				'PartNumber' : part,
				'ProcessSequence':processSequenceList,
				'Material Description':partDesc,
				'Requested Quantity' :jobCards[i]["requestedQuantity"],
				'Actual Quantity':jobCards[i]["actualQuantity"],
				'Balance Quantity':balanceQty,
				'% Of Adherence' : Adherence,
				'Pending Process':pendingProcessSequence,
				'Job Card Status':jobCards[i]["jobcardStatus"]
			}
			shiftWiseJobCards.push(jobCardsList);
		}
		else{
			var jobCardsList = {
				'Created Date': createdAt,
				'Estimated Date' : jobCards[i]["estimatedDate"],
				'Completed Date' : updatedAt,
				'Cell No': cellName,
				'Shift':Shift,
				'Job Card Serial':jobCards[i]["barcodeSerial"],
				'PartNumber' : part,
				'ProcessSequence':processSequenceList,
				'Material Description':partDesc,
				'Requested Quantity' :jobCards[i]["requestedQuantity"],
				'Actual Quantity':jobCards[i]["actualQuantity"],
				'Balance Quantity':balanceQty,
				'% Of Adherence' : Adherence,
				'Pending Process':pendingProcessSequence,
				'Job Card Status':jobCards[i]["jobcardStatus"]
			}
			shiftWiseJobCards.push(jobCardsList);
		}
	}
	if(Shift == "D"){
		curr_date = d.getDate()-1;
		dateTimeFormat = curr_date + "-" + curr_month + "-" + curr_year;
		var xls1 = json2xls(shiftWiseJobCards);
		var filename1 = 'D:/TMML/BRiOT-TMML-Machine-Shop-Solution/server/Reports/PlanVsActualDay/Plan-Vs-Actual-Day '+ dateTimeFormat +'.xlsx';
		fs.writeFileSync(filename1, xls1, 'binary',function(err) {
			if (err) {
				console.log('Some error occured - file either not saved or corrupted file saved.');
				sails.log.error("Some error occured - file either not saved or corrupted file saved.");
			} else {
				console.log('It\'s saved!');
			}
		});

		var receiversList = await ReportList.find({
			name : "Plan vs Actual for the day"
		});
		receiversList = receiversList[0]["email"];
		var mailText = "PFA for Plan Vs Actual For the Day Report details";
		var mailOptions = {
    from: "MachineShop_WIP@tatamarcopolo.com", // sender address (who sends)
    // to: receiversList,// list of receivers (who receives)
    to: "santosh.adaki@tatamarcopolo.com",
    subject: "Plan Vs Actual Day Report", // Subject line
    text: mailText,
    attachments :[
    {
    	'filename':'Plan-Vs-Actual-Day Report '+dateTimeFormat+'.xlsx',
    	'path': filename1
    }
    ],
  };
  transporter.sendMail(mailOptions, function(error, info) {
  	if(error){
  		sails.log.error("Daily report mail not sent",error);
  	} else {
  		sails.log.info('Message sent: ' + info.response);
  	}
  });
}
else{
	var xls1 = json2xls(shiftWiseJobCards);
	var filename1 = 'D:/TMML/BRiOT-TMML-Machine-Shop-Solution/server/Reports/ShiftWiseReport/Shift-Wise-Report '+ dateTimeFormat +' Shift'+Shift+'.xlsx';
	fs.writeFileSync(filename1, xls1, 'binary',function(err) {
		if (err) {
			console.log('Some error occured - file either not saved or corrupted file saved.');
			sails.log.error("Some error occured - file either not saved or corrupted file saved.");
		} else {
			console.log('It\'s saved!');
		}
	});

	var receiversList = await ReportList.find({
		name : "Plan vs Actual for the shift"
	});
	receiversList = receiversList[0]["email"];
	var mailText = "PFA for Shift Wise Report details";
	var mailOptions = {
    from: "MachineShop_WIP@tatamarcopolo.com", // sender address (who sends)
    // to: receiversList,// list of receivers (who receives)
    to: "santosh.adaki@tatamarcopolo.com",
    subject: "Shift Wise Report", // Subject line
    text: mailText,
    attachments :[
    {
    	'filename':'ShiftWise Report '+dateTimeFormat+' Shift'+Shift+'.xlsx',
    	'path': filename1
    }
    ],
  };
  transporter.sendMail(mailOptions, function(error, info) {
  	if(error){
  		sails.log.error("Shift Wise report mail not sent",error);
  	} else {
  		sails.log.info('Message sent: ' + info.response);
  	}
  });
}
}
else{
	sails.log.info("No Data Found");
	console.log("No Data Found");
}

},

dailyErrorReport:async function(req,res){
	errorParts = [];
	var selfSignedConfig = {
		host: '128.9.24.24',
		port: 25
		
	};
	var transporter = nodemailer.createTransport(selfSignedConfig);

	var dateTimeFormat;
	var updatedAtStart=0;
	var updatedAtEnd=0;
	var d = new Date();
	var curr_date = d.getDate();
	if(curr_date.toString().length == 1){
		curr_date = "0" + curr_date
	}
	var curr_month = parseInt(d.getMonth()) + 1;
	curr_month = ""+curr_month;
	if(curr_month.toString().length == 1){
		curr_month = "0" + curr_month
	}
	var curr_year = d.getFullYear();
	curr_year = curr_year.toString();
	curr_year = curr_year.substring(2,4);
	dateTimeFormat = curr_date + "-" + curr_month + "-" + curr_year;

	var sql = `SELECT partNumber,[TestDatabase].dbo.partnumber.description as partDesc,manPower,SMH,[TestDatabase].dbo.partnumber.remarks,materialGroup,[TestDatabase].dbo.partnumber.UOM as partUOM,rawMaterialId,(select top 1 rawMaterialNumber from [TestDatabase].dbo.rawmaterial with (nolock) where [TestDatabase].dbo.rawmaterial.id
	= [TestDatabase].dbo.partnumber.rawMaterialId ) as rawMaterial,(select top 1 [TestDatabase].dbo.rawmaterial.description from [TestDatabase].dbo.rawmaterial with (nolock) where [TestDatabase].dbo.rawmaterial.id
	= [TestDatabase].dbo.partnumber.rawMaterialId ) as rawDescription FROM [TestDatabase].[dbo].[partnumber] 
	inner join [TestDatabase].dbo.rawmaterial as rawMaterial on rawMaterial.id = [TestDatabase].[dbo].partnumber.rawMaterialId where [TestDatabase].dbo.partnumber.remarks NOT IN ('NA', '','OK','okay') ORDER BY [TestDatabase].dbo.partnumber.id DESC`;
	console.log("sql",sql);
	var parts = await sails.sendNativeQuery(sql,[]);

	console.log(parts["recordset"].length)
	for(var i=0;i<parts["recordset"].length;i++){
		var errorPart = {
			'Part Number' : parts["recordset"][i]["partNumber"],
			'Part Description' : parts["recordset"][i]["partDesc"],
			'Man Power' : parts["recordset"][i]["manPower"],
			'SMH' : parts["recordset"][i]["SMH"],
			'UOM' : parts["recordset"][i]["partUOM"],
			'Remarks' : parts["recordset"][i]["remarks"],
			'Material Group' : parts["recordset"][i]["materialGroup"],
			'Raw Material No' : parts["recordset"][i]["rawMaterial"],
			'Raw Material Description' : parts["recordset"][i]["rawDescription"]
		}
		errorParts.push(errorPart);
	}
	var xls1 = json2xls(errorParts);
	var filename1 = 'D:/TMML/BRiOT-TMML-Machine-Shop-Solution/server/Reports/ErrorReport/ErrorReport '+ dateTimeFormat +'.xlsx';
	
	fs.writeFileSync(filename1, xls1, 'binary',function(err) {
		if (err) {
			console.log('Some error occured - file either not saved or corrupted file saved.');
			sails.log.error("Some error occured - file either not saved or corrupted file saved.");
		} else {
			console.log('It\'s saved!');
		}
	});
	var receiversList = await ReportList.find({
		name : "Error report of process sequence defined wrong"
	});
	receiversList = receiversList[0]["email"];
	curr_date = d.getDate()-1;
	var dateTimeFormat1 = curr_date + "-" + curr_month + "-" + curr_year;
	var mailText = "PFA for Error report of process sequence defined wrong as of Date "+dateTimeFormat1;
	console.log(mailText);
	var mailOptions = {
    from: "MachineShop_WIP@tatamarcopolo.com", // sender address (who sends)
    // from:"Sagar@briot.in",
    //to: receiversList,
    to:"santosh.adaki@tatamarcopolo.com",
    subject: "Error report of process sequence defined wrong", // Subject line
    text: mailText,
    attachments :[
    {
    	'filename':'ErrorReport '+dateTimeFormat+'.xlsx',
    	'path': filename1
    }
    ],
  };
  transporter.sendMail(mailOptions, function(error, info) {
  	if(error){
  		sails.log.error("Error report mail not sent",error);
  	} else {
  		sails.log.info('Message sent: ' + info.response);
  	}
  });
},

dailyVsPlanVsReceivedReport:async function(req,res){
	jobCardsList = [];
	var selfSignedConfig = {
		host: '128.9.24.24',
		port: 25
		
	};
	var transporter = nodemailer.createTransport(selfSignedConfig);

	var dateTimeFormat;
	var updatedAtStart=0;
	var updatedAtEnd=0;
	var d = new Date();
	var curr_date = d.getDate()-1;
	if(curr_date.toString().length == 1){
		curr_date = "0" + curr_date
	}
	var curr_month = parseInt(d.getMonth()) + 1;
	curr_month = ""+curr_month;
	if(curr_month.toString().length == 1){
		curr_month = "0" + curr_month
	}
	var curr_year = d.getFullYear();
	curr_year = curr_year.toString();
	curr_year = curr_year.substring(2,4);
	dateTimeFormat = curr_date + "-" + curr_month + "-" + curr_year;

	var startTime =  (parseInt(d.getMonth()) + 1) +"-"+ (parseInt(d.getDate()) - 1) +"-"+ d.getFullYear()+ " " +"00:00:01";
	var dt = new Date(startTime);
	updatedAtStart=dt.setSeconds( dt.getSeconds());
	var EndTime =  (parseInt(d.getMonth()) + 1) +"-"+ (parseInt(d.getDate()) - 1) +"-"+ d.getFullYear()+ " " +"23:59:00";
	dt = new Date(EndTime);
	updatedAtEnd=dt.setSeconds( dt.getSeconds());
	console.log("TimeStamps: ",updatedAtStart,updatedAtEnd);

	var sql = `select barcodeSerial,requestedQuantity,actualQuantity,[TestDatabase].dbo.jobcard.createdAt as createdAt,[TestDatabase].dbo.jobcard.estimatedDate,[TestDatabase].dbo.jobcard.updatedAt as updatedAt,productionSchedulePartRelationId,
	(select top 1 material from [TestDatabase].dbo.saptransaction where [TestDatabase].dbo.saptransaction.jobCard = [TestDatabase].dbo.jobcard.barcodeSerial) as SAPMaterial,(select top 1 quantity from [TestDatabase].dbo.saptransaction where
	[TestDatabase].dbo.saptransaction.jobCard = [TestDatabase].dbo.jobcard.barcodeSerial) as SAPQuantity,
	(select top 1 remarks from [TestDatabase].dbo.saptransaction where [TestDatabase].dbo.saptransaction.jobCard = [TestDatabase].dbo.jobcard.barcodeSerial) as ReceivedStatus
	from [TestDatabase].dbo.jobcard inner join [TestDatabase].dbo.saptransaction as sap on sap.jobCard = [TestDatabase].dbo.jobcard.barcodeSerial where [TestDatabase].dbo.jobcard.updatedAt between `+updatedAtStart+` AND `+updatedAtEnd+`  ORDER BY [TestDatabase].dbo.jobcard.id DESC`;
	console.log("sql",sql);
	var jobCards = await sails.sendNativeQuery(sql,[]);

	console.log(jobCards["recordset"].length)
	if(jobCards["recordset"].length !=0){
		for(var i=0;i<jobCards["recordset"].length;i++){
			var TimeStamp = parseInt(jobCards["recordset"][i]["createdAt"]);
			console.log("TimeStamp",jobCards["recordset"][i]);
			var createdDate = new Date(TimeStamp);
			console.log("Created  Date",createdDate);
			createdDate = createdDate.toDateString();
			TimeStamp = parseInt(jobCards["recordset"][i]["updatedAt"]);
			var updatedAt = new Date(TimeStamp);
			updatedAt = updatedAt.toDateString();
			console.log(createdDate,updatedAt);

			var jobCardPart = {
				'Job Card Serial' : jobCards["recordset"][i]["barcodeSerial"],
				'Part Number' : jobCards["recordset"][i]["SAPMaterial"],
				'Requested Quantity' : jobCards["recordset"][i]["requestedQuantity"],
				'Actual Quantity' : jobCards["recordset"][i]["actualQuantity"],
				'Created Date' : createdDate,
				'Estimated Date' : jobCards["recordset"][i]["estimatedDate"],
				'Completed Date' : updatedAt,
				'SAP Part Number' : jobCards["recordset"][i]["SAPMaterial"],
				'SAP Quantity' : jobCards["recordset"][i]["SAPQuantity"],
				'Received Status':jobCards["recordset"][i]["ReceivedStatus"]
			}
			jobCardsList.push(jobCardPart);
		}
		var xls1 = json2xls(jobCardsList);
		var filename1 = 'D:/TMML/BRiOT-TMML-Machine-Shop-Solution/server/Reports/PlanVsActualVsReceivedStatus/Plan-Vs-Actual-Vs-Received-Status '+ dateTimeFormat +'.xlsx';
		fs.writeFileSync(filename1, xls1, 'binary',function(err) {
			if (err) {
				console.log('Some error occured - file either not saved or corrupted file saved.');
				sails.log.error("Some error occured - file either not saved or corrupted file saved.");
			} else {
				console.log('It\'s saved!');
			}
		});
		var receiversList = await ReportList.find({
			name : "Daily plan vs actual vs received status against job card"
		});
		receiversList = receiversList[0]["email"];
		var mailText = "PFA for Plan Vs Actual Vs Received status Report";
		console.log(mailText);
		var mailOptions = {
    from: "MachineShop_WIP@tatamarcopolo.com", // sender address (who sends)
    // from:"Sagar@briot.in",
    //to: receiversList,
    to:"santosh.adaki@tatamarcopolo.com",
    subject: "Daily plan vs actual vs received status against job card Report", // Subject line
    text: mailText,
    attachments :[
    {
    	'filename':'Plan-Vs-Actual-Vs-Received-Status '+dateTimeFormat+'.xlsx',
    	'path': filename1
    }
    ],
  };
  transporter.sendMail(mailOptions, function(error, info) {
  	if(error){
  		sails.log.error("Plan-Vs-Actual-Vs-Received-Status mail not sent",error);
  	} else {
  		sails.log.info('Message sent: ' + info.response);
  	}
  });
}
},

dailyCreatedJobCardReport:async function(req,res){
	jobCardsList = [];
	var selfSignedConfig = {
		host: '128.9.24.24',
		port: 25
		
	};
	var transporter = nodemailer.createTransport(selfSignedConfig);
  var processSequenceList="";
	var dateTimeFormat;
	var updatedAtStart=0;
	var updatedAtEnd=0;
	var d = new Date();
	var curr_date = d.getDate()-1;
	if(curr_date.toString().length == 1){
		curr_date = "0" + curr_date
	}
	var curr_month = parseInt(d.getMonth()) + 1;
	curr_month = ""+curr_month;
	if(curr_month.toString().length == 1){
		curr_month = "0" + curr_month
	}
	var curr_year = d.getFullYear();
	curr_year = curr_year.toString();
	curr_year = curr_year.substring(2,4);
	dateTimeFormat = curr_date + "-" + curr_month + "-" + curr_year;

	var startTime =  (parseInt(d.getMonth()) + 1) +"-"+ (parseInt(d.getDate()) - 1) +"-"+ d.getFullYear()+ " " +"00:00:01";
	var dt = new Date(startTime);
	updatedAtStart=dt.setSeconds( dt.getSeconds());
	var EndTime =  (parseInt(d.getMonth()) + 1) +"-"+ (parseInt(d.getDate()) - 1)+"-"+ d.getFullYear()+ " " +"23:59:00";
	dt = new Date(EndTime);
	updatedAtEnd=dt.setSeconds( dt.getSeconds());
	console.log("TimeStamps: ",updatedAtStart,updatedAtEnd);

	var sql = `select barcodeSerial,requestedQuantity,actualQuantity,[TestDatabase].dbo.jobcard.createdAt as createdAt,[TestDatabase].dbo.jobcard.estimatedDate,[TestDatabase].dbo.jobcard.updatedAt as updatedAt,productionSchedulePartRelationId,jobcardStatus,
	(select top 1 partNumber from [TestDatabase].dbo.partnumber where [TestDatabase].dbo.partnumber.id = ((select top 1 partNumberId from [TestDatabase].dbo.productionschedulepartrelation where [TestDatabase].dbo.productionschedulepartrelation.id = [TestDatabase].dbo.jobcard.productionSchedulePartRelationId))) as PartNumber
	from [TestDatabase].dbo.jobcard inner join [TestDatabase].dbo.saptransaction as sap on sap.jobCard =  [TestDatabase].dbo.jobcard.barcodeSerial where [TestDatabase].dbo.jobcard.updatedAt between 1565684192322 AND 1566966195253 ORDER BY [TestDatabase].dbo.jobcard.id DESC`;
	console.log("sql",sql);
	var jobCards = await sails.sendNativeQuery(sql,[]);

	console.log(jobCards["recordset"].length)
	if(jobCards["recordset"].length !=0){
		for(var i=0;i<jobCards["recordset"].length;i++){
			var TimeStamp = parseInt(jobCards["recordset"][i]["createdAt"]);
			console.log("TimeStamp",jobCards["recordset"][i]);
			var createdDate = new Date(TimeStamp);
			console.log("Created  Date",createdDate);
			createdDate = createdDate.toDateString();
			TimeStamp = parseInt(jobCards["recordset"][i]["updatedAt"]);
			var updatedAt = new Date(TimeStamp);
			updatedAt = updatedAt.toDateString();
			console.log(createdDate,updatedAt);

			var processSequence1;
			var processSequence2;
			var processSequence3;
			var processSequence4;
			var processSequence5;
			var jobcard = await JobCard.find({
				barcodeSerial : jobCards["recordset"][i]["barcodeSerial"]
			});

			if(jobcard!=null&&jobcard!=undefined) {

				var productionSchedulePartRelation = await ProductionSchedulePartRelation.find({
					id:jobcard[0]["productionSchedulePartRelationId"]
				});

				if(productionSchedulePartRelation != null && productionSchedulePartRelation != undefined){
					var processSequence = await ProcessSequence.find({
						partId:productionSchedulePartRelation[0]["partNumberId"],
						status :1
					});

					if(processSequence[0] != null && processSequence[0] != undefined){
						if(processSequence.length == 1){
							var machineGroup = await MachineGroup.find({
								id:processSequence[0]["machineGroupId"]
							});
							if(machineGroup!=null&&machineGroup!=undefined){
								var machineType = await MachineType.find({
									id:machineGroup[0]["machineTypeId"]
								});

								processSequence1 = machineType[0]["name"];
							}
						}
						else if(processSequence.length == 2){
							var machineGroup = await MachineGroup.find({
								id:processSequence[0]["machineGroupId"]
							});
							if(machineGroup!=null&&machineGroup!=undefined){
								var machineType = await MachineType.find({
									id:machineGroup[0]["machineTypeId"]
								});
								processSequence1 = machineType[0]["name"];
							}
							var machineGroup = await MachineGroup.find({
								id:processSequence[1]["machineGroupId"]
							});
							if(machineGroup!=null&&machineGroup!=undefined){
								var machineType = await MachineType.find({
									id:machineGroup[0]["machineTypeId"]
								});
								processSequence2 = machineType[0]["name"];
							}
						}
						else if(processSequence.length == 3){
							var machineGroup = await MachineGroup.find({
								id:processSequence[0]["machineGroupId"]
							});
							if(machineGroup!=null&&machineGroup!=undefined){
								var machineType = await MachineType.find({
									id:machineGroup[0]["machineTypeId"]
								});
								processSequence1 = machineType[0]["name"];
							}
							var machineGroup = await MachineGroup.find({
								id:processSequence[1]["machineGroupId"]
							});
							if(machineGroup!=null&&machineGroup!=undefined){
								var machineType = await MachineType.find({
									id:machineGroup[0]["machineTypeId"]
								});
								processSequence2 = machineType[0]["name"];
							}
							var machineGroup = await MachineGroup.find({
								id:processSequence[2]["machineGroupId"]
							});
							if(machineGroup!=null&&machineGroup!=undefined){
								var machineType = await MachineType.find({
									id:machineGroup[0]["machineTypeId"]
								});
								processSequence3 = machineType[0]["name"];
							}
						}
						else if(processSequence.length == 4){
							var machineGroup = await MachineGroup.find({
								id:processSequence[0]["machineGroupId"]
							});
							if(machineGroup!=null&&machineGroup!=undefined){
								var machineType = await MachineType.find({
									id:machineGroup[0]["machineTypeId"]
								});
								processSequence1 = machineType[0]["name"];
							}
							var machineGroup = await MachineGroup.find({
								id:processSequence[1]["machineGroupId"]
							});
							if(machineGroup!=null&&machineGroup!=undefined){
								var machineType = await MachineType.find({
									id:machineGroup[0]["machineTypeId"]
								});
								processSequence2 = machineType[0]["name"];
							}
							var machineGroup = await MachineGroup.find({
								id:processSequence[2]["machineGroupId"]
							});
							if(machineGroup!=null&&machineGroup!=undefined){
								var machineType = await MachineType.find({
									id:machineGroup[0]["machineTypeId"]
								});
								processSequence3 = machineType[0]["name"];
							}
							var machineGroup = await MachineGroup.find({
								id:processSequence[3]["machineGroupId"]
							});
							if(machineGroup!=null&&machineGroup!=undefined){
								var machineType = await MachineType.find({
									id:machineGroup[0]["machineTypeId"]
								});
								processSequence4 = machineType[0]["name"];
							}
						}
						else if(processSequence.length == 5){
							var machineGroup = await MachineGroup.find({
								id:processSequence[0]["machineGroupId"]
							});
							if(machineGroup!=null&&machineGroup!=undefined){
								var machineType = await MachineType.find({
									id:machineGroup[0]["machineTypeId"]
								});
								processSequence1 = machineType[0]["name"];
							}
							var machineGroup = await MachineGroup.find({
								id:processSequence[1]["machineGroupId"]
							});
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence2 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[2]["machineGroupId"]
						});
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence3 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[3]["machineGroupId"]
						});
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence4 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[4]["machineGroupId"]
						});
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence5 = machineType[0]["name"];
						}
					}
				}
			}
		}
		var totalProcesses=[];
		var processes = {
			processSequence1:processSequence1,
			processSequence2:processSequence2,
			processSequence3:processSequence3,
			processSequence4:processSequence4,
			processSequence5:processSequence5,
		}
		//console.log(processes);
		if(jobCards["recordset"][i]["jobcardStatus"] == "Completed"){
			updatedAt = "NA";
		}
		totalProcesses.push(processes);
		processSequenceList = totalProcesses[0];
		var jobCardPart = {
			'Job Card Serial' : jobCards["recordset"][i]["barcodeSerial"],
			'Part Number' : jobCards["recordset"][i]["PartNumber"],
			'Requested Quantity' : jobCards["recordset"][i]["requestedQuantity"],
			'Actual Quantity' : jobCards["recordset"][i]["actualQuantity"],
			'Created Date' : createdDate,
			'Estimated Date' : jobCards["recordset"][i]["estimatedDate"],
			'Completed Date' : updatedAt,
			'Process Sequence' : processSequenceList,
			'Job Card Status' : jobCards["recordset"][i]["jobcardStatus"]
		}
		jobCardsList.push(jobCardPart);
	}
	var xls1 = json2xls(jobCardsList);
	var filename1 = 'D:/TMML/BRiOT-TMML-Machine-Shop-Solution/server/Reports/DailyCreatedJobCard/Daily-Created-JobCard '+ dateTimeFormat +'.xlsx';
	fs.writeFileSync(filename1, xls1, 'binary',function(err) {
		if (err) {
			console.log('Some error occured - file either not saved or corrupted file saved.');
			sails.log.error("Some error occured - file either not saved or corrupted file saved.");
		} else {
			console.log('It\'s saved!');
		}
	});
	var receiversList = await ReportList.find({
		name : "Daily Created Job Card"
	});
	receiversList = receiversList[0]["email"];
	var mailText = "PFA for Daily Created Job Cards Report";
	console.log(mailText);
	var mailOptions = {
    from: "MachineShop_WIP@tatamarcopolo.com", // sender address (who sends)
    // from:"Sagar@briot.in",
    //to: receiversList,
    to:"santosh.adaki@tatamarcopolo.com",
    subject: "Daily created job card Report", // Subject line
    text: mailText,
    attachments :[
    {
    	'filename':'Daily-Created-JobCard '+dateTimeFormat+'.xlsx',
    	'path': filename1
    }
    ],
  };
  transporter.sendMail(mailOptions, function(error, info) {
  	if(error){
  		sails.log.error("Daily Created jobCard report mail not sent",error);
  	} else {
  		sails.log.info('Message sent: ' + info.response);
  	}
  });
}
},

};