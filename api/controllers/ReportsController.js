var nodemailer = require ('nodemailer');
var json2xls = require('json2xls');
var fs = require('fs');
const roundTo = require('round-to');
var self = module.exports = {

	//---------------------  Shift Wise and Daily Report (Managed In Same Function) (For Day wise Report-Shift D )  -----------
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
		else if(checkShift == "5:50"){
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
				var totalProcesses =await self.totalProcessesFunction(jobCards[i]["barcodeSerial"]);
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
  		sails.log.info('Daily report mail sent: ' + info.response);
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
  		sails.log.info('Shift Wise report sent: ' + info.response);
  	}
  });
}
}
else{
	sails.log.info("No Data Found");
	console.log("No Data Found");
}

},

// ----------------- Daily Error Report (Process Sequence Defined Wrong) -------------------------------

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
  		sails.log.info('Error report mail sent: ' + info.response);
  	}
  });
},

//------------------ Daily Vs Plan VS Received Status Report (SAP Report) --------------

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
  		sails.log.info('Plan-Vs-Actual-Vs-Received-Status Message sent: ' + info.response);
  	}
  });
}
},


//---- Daily Created Job Cards ---------------------

dailyCreatedJobCardReport:async function(req,res){
	machineWiseJobCardsList = [];
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

			var totalProcesses =await self.totalProcessesFunction(jobCards["recordset"][i]["barcodeSerial"]);

			if(jobCards["recordset"][i]["jobcardStatus"] == "Completed"){
				updatedAt = "NA";
			}
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
  		sails.log.info('Daily Created jobCard report Message sent: ' + info.response);
  	}
  });
}
},


 //-------------- Machine Wise Report --------------------

machineWiseReport:async function(req,res){
	machineWiseJobCardsList = [];
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
	console.log(updatedAtStart,updatedAtEnd);
	var sql = `SELECT distinct machineId
	FROM [TestDatabase].[dbo].[jobprocesssequencerelation] where updatedAt between `+updatedAtStart+` AND `+updatedAtEnd+` order by machineId asc`;
	console.log("sql",sql);
	var machineIdsList = await sails.sendNativeQuery(sql,[]);
	console.log("length",machineIdsList["recordset"].length);
	for(var a=0;a<machineIdsList["recordset"].length;a++){
		if(machineIdsList["recordset"][a]["machineId"] !=null && machineIdsList["recordset"][a]["machineId"] != undefined){
			var jobCards = await JobProcessSequenceRelation.find({
				where:{updatedAt :{ '>=':updatedAtStart,'<=':updatedAtEnd}, machineId : machineIdsList["recordset"][a]["machineId"]},sort: [{ id: 'DESC'}]
			}).populate('jobId')
			.populate('processSequenceId')
			.populate('machineId')
			.populate('locationId')
			.populate('operatorId');
		}
		for(var b=0;b<jobCards.length;b++){
			var partNumber = "";
			var partDesc = "";
			var processSequence = "";
			var parts = await PartNumber.find({
				id: jobCards[b]["processSequenceId"]["partId"]
			});
			if(parts[0] != null && parts[0] != undefined){
				partNumber = parts[0]["partNumber"];
				partDesc = parts[0]["description"];
			}
			var totalProcesses =await self.totalProcessesFunction(jobCards[b]["jobId"]["barcodeSerial"]);
			if(jobCards[b]["processSequenceId"]["sequenceNumber"] == 1){
				processSequence = totalProcesses[0]["processSequence1"];
			}
			else if(jobCards[b]["processSequenceId"]["sequenceNumber"] == 2){
				processSequence = totalProcesses[0]["processSequence2"];
			}
			else if(jobCards[b]["processSequenceId"]["sequenceNumber"] == 3){
				processSequence = totalProcesses[0]["processSequence3"];
			}
			else if(jobCards[b]["processSequenceId"]["sequenceNumber"] == 4){
				processSequence = totalProcesses[0]["processSequence4"];
			}
			else if(jobCards[b]["processSequenceId"]["sequenceNumber"] == 5){
				processSequence = totalProcesses[0]["processSequence5"];
			}
			var TimeStamp = parseInt(jobCards[b]["jobId"]["createdAt"]);
			var createdDate = new Date(TimeStamp);
			createdDate = createdDate.toDateString();
			TimeStamp = parseInt(jobCards[b]["jobId"]["updatedAt"]);
			var updatedAt = new Date(TimeStamp);
			updatedAt = updatedAt.toDateString();

			var Shift =await self.shiftFunction(parseInt(jobCards[b]["jobId"]["updatedAt"]));
			if(jobCards[b]["jobId"]["jobcardStatus"] != "Completed"){
				updatedAt = "NA";
				Shift = "NA";
			}
			console.log("Shift",Shift);
			var machineWiseJobCard = {
				'Created Date': createdDate,
				'Estimated Date': jobCards[b]["jobId"]["estimatedDate"],
				'Completed Date': updatedAt,
				'Shift': Shift ,
				'Machine Name': jobCards[b]["machineId"]["machineName"], 
				'Operator Ticket No':jobCards[b]["operatorId"]["EmployeeId"],
				'Name Of Operator':jobCards[b]["operatorId"]["name"],
				'Job Card No':jobCards[b]["jobId"]["barcodeSerial"],
				'Part Number':partNumber,
				'Material Description':partDesc,
				'Process Sequence':processSequence,
				'Requested Quantity':jobCards[b]["jobId"]["requestedQuantity"],
				'Actual Quantity':jobCards[b]["jobId"]["actualQuantity"],
				'Balance Quantity':jobCards[b]["jobId"]["requestedQuantity"] - jobCards[b]["jobId"]["actualQuantity"],
				'% Of Adherence':((jobCards[b]["jobId"]["actualQuantity"] / jobCards[b]["jobId"]["requestedQuantity"])*100),
				'Machine Status':jobCards[b]["machineId"]["maintenanceStatus"],
				'Remark':jobCards[b]["jobId"]["jobcardStatus"]
			}
			machineWiseJobCardsList.push(machineWiseJobCard);
		} 
	}
	var xls1 = json2xls(machineWiseJobCardsList);
	dateTimeFormat = curr_date + "-" + curr_month + "-" +d.getFullYear();
	var filename1 = 'D:/TMML/BRiOT-TMML-Machine-Shop-Solution/server/Reports/DailyCreatedJobCard/Daily-Created-JobCard '+ dateTimeFormat +'.xlsx';
	// var filename1 = 'D:/TMML/Reports/MachineWise/Machine-Wise-JobCard '+ dateTimeFormat +'.xlsx';
	fs.writeFileSync(filename1, xls1, 'binary',function(err) {
		if (err) {
			console.log('Some error occured - file either not saved or corrupted file saved.');
			sails.log.error("Some error occured - file either not saved or corrupted file saved.");
		} else {
			console.log('It\'s saved!');
		}
	});
	var receiversList = await ReportList.find({
		name : "Plan vs Actual for the machine"
	});
	receiversList = receiversList[0]["email"];
	var mailText = "PFA for Machine Wise JobCard Report for "+dateTimeFormat+" Date";
	console.log(mailText);
	var mailOptions = {
    from: "MachineShop_WIP@tatamarcopolo.com", // sender address (who sends)
    // from:"Sagar@briot.in",
    //to: receiversList,
    to:"santosh.adaki@tatamarcopolo.com",
    subject: "Machine Wise job cards Report", // Subject line
    text: mailText,
    attachments :[
    {
    	'filename':'Machine-Wise-JobCard '+dateTimeFormat+'.xlsx',
    	'path': filename1
    }
    ],
  };
  transporter.sendMail(mailOptions, function(error, info) {
  	if(error){
  		sails.log.error("Machine-Wise-JobCard report mail not sent",error);
  	} else {
  		sails.log.info('Machine-Wise-JobCard Message sent: ' + info.response);
  	}
  });

},


//----------------- Plan SMH Vs AMH Report Partwise ---------

partWiseSMHReport:async function(req,res){
	partsList = [];
	var selfSignedConfig = {
		host: '128.9.24.24',
		port: 25
		
	};
	var transporter = nodemailer.createTransport(selfSignedConfig);
	var processSequenceList="";
	var dateTimeFormat;
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
	updatedAtStart = dt.setSeconds( dt.getSeconds());
	var EndTime =  (parseInt(d.getMonth()) + 1) +"-"+ (parseInt(d.getDate()) - 1)+"-"+ d.getFullYear()+ " " +"23:59:00";
	dt = new Date(EndTime);
	updatedAtEnd = dt.setSeconds( dt.getSeconds());
	console.log("TimeStamp",updatedAtStart,updatedAtEnd);
	var jobCards = await JobProcessSequenceRelation.find({
		where:{ updatedAt :{ '>=':updatedAtStart,'<=':updatedAtEnd},
		processStatus:"Completed",processStatus:"FinalLocation"},sort: [{ id: 'DESC'}]
	}).populate('jobId')
	.populate('processSequenceId')
	.populate('machineId')
	.populate('locationId')
	.populate('operatorId');

	for(var b=0;b<jobCards.length;b++){
		var partNumber = "";
		var partDesc = "";
		var manPower = 0;
		var processSequence = "";
		var parts = await PartNumber.find({
			id: jobCards[b]["processSequenceId"]["partId"]
		});
		if(parts[0] != null && parts[0] != undefined){
			partNumber = parts[0]["partNumber"];
			partDesc = parts[0]["description"];
			manPower = parts[0]["manPower"];
		}
		var totalProcesses =await self.totalProcessesFunction(jobCards[b]["jobId"]["barcodeSerial"]);
		if(jobCards[b]["processSequenceId"]["sequenceNumber"] == 1){
			processSequence = totalProcesses[0]["processSequence1"];
		}
		else if(jobCards[b]["processSequenceId"]["sequenceNumber"] == 2){
			processSequence = totalProcesses[0]["processSequence2"];
		}
		else if(jobCards[b]["processSequenceId"]["sequenceNumber"] == 3){
			processSequence = totalProcesses[0]["processSequence3"];
		}
		else if(jobCards[b]["processSequenceId"]["sequenceNumber"] == 4){
			processSequence = totalProcesses[0]["processSequence4"];
		}
		else if(jobCards[b]["processSequenceId"]["sequenceNumber"] == 5){
			processSequence = totalProcesses[0]["processSequence5"];
		}

		var createdDate =parseInt(jobCards[b]["jobId"]["createdAt"]);
		var updatedAt = parseInt(jobCards[b]["jobId"]["updatedAt"]); 
		var Shift =await self.shiftFunction(updatedAt);
		var TimeStamp = parseInt(jobCards[b]["jobId"]["createdAt"]);
		createdDate = new Date(TimeStamp);
		createdDate = createdDate.toDateString();
		TimeStamp = parseInt(jobCards[b]["jobId"]["updatedAt"]);
		updatedAt = new Date(TimeStamp);
		updatedAt = updatedAt.toDateString();
		
		if(jobCards[b]["jobId"]["jobcardStatus"] != "Completed"){
			updatedAt = "NA";
			Shift = "NA";
		}
		console.log("Shift",Shift);
		var SMH=roundTo((jobCards[b]["processSequenceId"]["cycleTime"] * manPower)/3600,4);
		console.log("SMH",SMH);
		var AMH=((parseInt(jobCards[b]["endTime"]) - parseInt(jobCards[b]["startTime"])) / 3.6e+6) * jobCards[b]["jobId"]["requestedQuantity"];
		AMH=roundTo(AMH,4);
		var GAP=roundTo(AMH - SMH,4); 
		var Adherence = ((jobCards[b]["jobId"]["actualQuantity"] / jobCards[b]["jobId"]["requestedQuantity"]) * 100);
		var jobcard = {
			'Created Date':createdDate,
			'Estimated Date':jobCards[b]["jobId"]["estimatedDate"],
			'Completed Date':updatedAt,
			'Shift':Shift,
			'Machine Name':jobCards[b]["machineId"]["machineName"],
			'Operator Ticket No':jobCards[b]["operatorId"]["employeeId"],
			'Name Of Operator':jobCards[b]["operatorId"]["name"],
			'Job Card No':jobCards[b]["jobId"]["barcodeSerial"],
			'Part Number':partNumber,
			'Material Description':partDesc,
			'Process Sequence':processSequence,
			'Requested Quantity':jobCards[b]["jobId"]["requestedQuantity"],
			'Part SMH':SMH,
			'Part AMH':AMH,
			'Gap':GAP,
			'Reason For Gap':"",
			'Remarks':jobCards[b]["jobId"]["jobcardStatus"]
		}
		partsList.push(jobcard);
	} 
	var xls1 = json2xls(partsList);
	dateTimeFormat = curr_date + "-" + curr_month + "-" +d.getFullYear();
	var filename1 = 'D:/TMML/BRiOT-TMML-Machine-Shop-Solution/server/Reports/DailyCreatedJobCard/Daily-Created-JobCard '+ dateTimeFormat +'.xlsx';
	// var filename1 = 'D:/TMML/Reports/SMHVsAMHPart/SMH-Vs-AMH-PartWise '+ dateTimeFormat +'.xlsx';
	fs.writeFileSync(filename1, xls1, 'binary',function(err) {
		if (err) {
			console.log('Some error occured - file either not saved or corrupted file saved.');
			sails.log.error("Some error occured - file either not saved or corrupted file saved.");
		} else {
			console.log('It\'s saved!');
		}
	});
	var receiversList = await ReportList.find({
		name : "SMH Vs AMH for each part"
	});
	receiversList = receiversList[0]["email"];
	var mailText = "PFA for SMH Vs AMH for each part Report";
	console.log(mailText);
	var mailOptions = {
    from: "MachineShop_WIP@tatamarcopolo.com", // sender address (who sends)
    // from:"Sagar@briot.in",
    //to: receiversList,
    to:"santosh.adaki@tatamarcopolo.com",
    subject: "SMH Vs AMH for each part Report", // Subject line
    text: mailText,
    attachments :[
    {
    	'filename':'SMH-Vs-AMH-PartWise '+dateTimeFormat+'.xlsx',
    	'path': filename1
    }
    ],
  };
  transporter.sendMail(mailOptions, function(error, info) {
  	if(error){
  		sails.log.error("SMH-Vs-AMH-PartWise report mail not sent",error);
  	} else {
  		sails.log.info('SMH-Vs-AMH-PartWise Message sent: ' + info.response);
  	}
  });
},

//------------- WIP Report Day Wise -------------------------------

WIPReport:async function (req, res) {
	wipList = [];
	var selfSignedConfig = {
		host: '128.9.24.24',
		port: 25
		
	};
	var transporter = nodemailer.createTransport(selfSignedConfig);
	var dateTimeFormat;
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
	
	var startTime =  (parseInt(d.getMonth()) + 1) +"-"+ d.getDate() +"-"+ d.getFullYear()+ " " +"00:00:01";
	var dt = new Date(startTime);
	updatedAtStart = dt.setSeconds( dt.getSeconds());
	console.log("updatedAtStart",updatedAtStart);

	var jobCards = await JobCard.find({
		where:{ updatedAt :{'<=':updatedAtStart},jobcardStatus: 'In Progress'}
	}).populate('productionSchedulePartRelationId');

	for(var b=0;b<jobCards.length;b++){
		var partNumber = "";
		var partDesc = "";
		var rawmaterial= "";
		var rawDescription= "";
		var cellName = "";
		var machineName = "";
		var nextProcess = "";
		var currentProcess="";
		var currentProcessNo = 0;
		var nextSequenceNumber = 0;
		var nextProcessStatus = "";
		var firstProcess = "";
		var firstProcessStatus = "";
		var secondProcess = "";
		var secondProcessStatus = "";
		var thirdProcess = "";
		var thirdProcessStatus = "";
		var fourthProcess = "";
		var fourthProcessStatus = "";
		var fifthProcess = "";
		var fifthProcessStatus = ""; 
		processStatusOfCurrent = "";

		var parts = await PartNumber.find({
			id: jobCards[b]["productionSchedulePartRelationId"]["partNumberId"]
		}).populate('rawMaterialId');

		if(parts[0] != null && parts[0] != undefined){
			partNumber = parts[0]["partNumber"];
			partDesc = parts[0]["description"];
			rawmaterial = parts[0]["rawMaterialId"]["rawMaterialNumber"];
			rawDescription = parts[0]["rawMaterialId"]["description"];
		}

		var getProcessSequence = await ProcessSequence.find({
			sequenceNumber:1,
			partId: jobCards[b]["productionSchedulePartRelationId"]["partNumberId"],
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
				cellName = getCellName[0]["name"]
			}
		}

		var machineData = await JobProcessSequenceRelation.find({
			where:{ jobId :jobCards[b]["id"]},sort: [{ id: 'ASC'}]
		}).populate('machineId');
		if(machineData[0] != null && machineData[0] != undefined){
			machineName = machineData[0]["machineId"]["machineName"];
			for(var e=0;e<machineData.length;e++){
				var nextProcess = 0;
				var sequenceNumber = 0;
				if (machineData[e]["processStatus"] != "FinalLocation")
				{
					nextProcess = machineData[e]["sequenceNumber"];
					currentProcessNo = nextProcess;
					processStatusOfCurrent = machineData[e]["processStatus"];
					sequenceNumber =parseInt(machineData[e]["sequenceNumber"]) + 1;
					nextsequenceNumber = sequenceNumber;
					if(machineData.length < nextsequenceNumber)
					{
						nextProcessStatus = "Not Yet Started";
					}
					else if(machineData.length == nextsequenceNumber)
					{
						nextProcessStatus = machineData[sequenceNumber-1]["processStatus"];
					}
					else
					{
						nextProcessStatus = machineData[e + 1]["processStatus"];
					}
				}
			}
		}

		var totalProcesses = await self.totalProcessesFunction(jobCards[b]["barcodeSerial"]);
		if(currentProcessNo == 1)
		{
			firstProcess = totalProcesses[0]["processSequence1"];
			firstProcessStatus = processStatusOfCurrent;
			currentProcess = totalProcesses[0]["processSequence1"];
		}
		else if (currentProcessNo == 2)
		{
			firstProcess = totalProcesses[0]["processSequence1"];
			firstProcessStatus = "Completed";
			secondProcess = totalProcesses[0]["processSequence2"];
			if (processStatusOfCurrent == "")
			{
				secondProcessStatus = "Not Yet Started";
			}
			else
			{
				secondProcessStatus = processStatusOfCurrent;
				nextProcessStatus = processStatusOfCurrent;
			}
			currentProcess = totalProcesses[0]["processSequence2"];
		}
		else if (currentProcessNo == 3)
		{
			firstProcess = totalProcesses[0]["processSequence1"];
			firstProcessStatus = "Completed";
			secondProcess = totalProcesses[0]["processSequence2"];
			secondProcessStatus = "Completed";
			thirdProcess = totalProcesses[0]["processSequence3"];
			if (processStatusOfCurrent == "")
			{
				thirdProcessStatus = "Not Yet Started";
			}
			else
			{
				thirdProcessStatus = processStatusOfCurrent;
				nextProcessStatus = processStatusOfCurrent;
			}
			currentProcess = totalProcesses[0]["processSequence3"];
		}
		else if (currentProcessNo == 4)
		{
			firstProcess = totalProcesses[0]["processSequence1"];
			firstProcessStatus = "Completed";
			secondProcess = totalProcesses[0]["processSequence2"];
			secondProcessStatus = "Completed";
			thirdProcess = totalProcesses[0]["processSequence3"];
			thirdProcessStatus = "Completed";
			fourthProcess = totalProcesses[0]["processSequence4"];
			if (processStatusOfCurrent == "")
			{
				fourthProcessStatus = "Not Yet Started";
			}
			else
			{
				fourthProcessStatus = processStatusOfCurrent;
				nextProcessStatus = processStatusOfCurrent;
			}
			currentProcess = totalProcesses[0]["processSequence4"];
		}
		else if (currentProcessNo == 5)
		{
			firstProcess = totalProcesses[0]["processSequence1"];
			firstProcessStatus = "Completed";
			secondProcess = totalProcesses[0]["processSequence2"];
			secondProcessStatus = "Completed";
			thirdProcess = totalProcesses[0]["processSequence3"];
			thirdProcessStatus = "Completed";
			fourthProcess = totalProcesses[0]["processSequence4"];
			fourthProcessStatus = "Completed";
			fifthProcess = totalProcesses[0]["processSequence5"];
			if (processStatusOfCurrent == "")
			{
				fifthProcessStatus = "Not Yet Started";
			}
			else
			{
				fifthProcessStatus = processStatusOfCurrent;
				nextProcessStatus = processStatusOfCurrent;
			}
			currentProcess = totalProcesses[0]["processSequence5"];
		}
		if (nextsequenceNumber != null)
		{
			if (nextsequenceNumber == 2)
			{

				if (totalProcesses[0]["processSequence2"] != null && totalProcesses[0]["processSequence2"] != "")
				{
					nextProcess = totalProcesses[0]["processSequence2"];
					secondProcess = totalProcesses[0]["processSequence2"];
				}
				else
				{
					nextProcess = "NA";
				}
			}
			else if (nextsequenceNumber == 3)
			{
				if (totalProcesses[0]["processSequence3"] != null && totalProcesses[0]["processSequence3"] != "")
				{
					nextProcess = totalProcesses[0]["processSequence3"];
					thirdProcess = totalProcesses[0]["processSequence3"];
				}
				else
				{
					nextProcess = "NA";
				}
			}
			else if (nextsequenceNumber == 4)
			{
				if (totalProcesses[0]["processSequence4"] != null && totalProcesses[0]["processSequence4"] != "")
				{
					nextProcess = totalProcesses[0]["processSequence4"];
					fourthProcess = totalProcesses[0]["processSequence4"];
				}
				else
				{
					nextProcess = "NA";
				}
			}
			else if (nextsequenceNumber == 5)
			{
				if (totalProcesses[0]["processSequence5"] != null && totalProcesses[0]["processSequence5"] != "")
				{
					nextProcess = totalProcesses[0]["processSequence5"];
					fifthProcess = totalProcesses[0]["processSequence5"];
				}
				else
				{
					nextProcess = "NA";
				}
			}
		}

		if (firstProcessStatus == "Completed" && firstProcess !="" )
		{
			firstProcessStatus = firstProcessStatus + "/" + jobCards[b]["requestedQuantity"];
		}
		else if (firstProcess != "")
		{
			firstProcessStatus = firstProcessStatus;
		}
		else
		{
			firstProcessStatus = "";
		}
		if (secondProcessStatus == "Completed" && secondProcess != "")
		{
			secondProcessStatus = secondProcessStatus + "/" + jobCards[b]["requestedQuantity"];
		}
		else if (secondProcess != "")
		{
			secondProcessStatus = secondProcessStatus;
		}
		else
		{
			secondProcessStatus = "";
		}
		if (thirdProcessStatus == "Completed" && thirdProcess != "")
		{
			thirdProcessStatus = thirdProcessStatus + "/" + jobCards[b]["requestedQuantity"];
		}
		else if (thirdProcess != "")
		{
			thirdProcessStatus = thirdProcessStatus;
		}
		else
		{
			thirdProcessStatus = "";
		}
		if (fourthProcessStatus == "Completed" && fourthProcess != "")
		{
			fourthProcessStatus = fourthProcessStatus + "/" + jobCards[b]["requestedQuantity"];
		}
		else if (fourthProcess != "")
		{
			fourthProcessStatus = fourthProcessStatus;
		}
		else
		{
			fourthProcessStatus = "";
		}
		if (fifthProcessStatus == "Completed" && fifthProcess != "")
		{
			fifthProcessStatus = fifthProcessStatus + "/" + jobCards[b]["requestedQuantity"];
		}
		else if (fifthProcess != "")
		{
			fifthProcessStatus = fifthProcessStatus;
		}
		else
		{
			fifthProcessStatus = "";
		}

		var wipCard = {
			'Date': jobCards[b]["estimatedDate"],
			'Cell No': cellName ,
			'Job Card Serial': jobCards[b]["barcodeSerial"],
			'Machine Name': machineName,
			'First Process': firstProcess,
			'First Process Status': firstProcessStatus, 
			'Second Process': secondProcess,
			'Second Process Status': secondProcessStatus, 
			'Third Process': thirdProcess,
			'Third Process Status': thirdProcessStatus , 
			'Fourth Process': fourthProcess,
			'Fourth Process Status': fourthProcessStatus, 
			'Fifth Process': fifthProcess,
			'Fifth Process Status': fifthProcessStatus, 
			'Part Number': partNumber,
			'Material Description': partDesc,
			'WIP Quantity': jobCards[b]["requestedQuantity"],
			'Plan (Requested) Quantity': jobCards[b]["requestedQuantity"],
			'Pending Quantity': jobCards[b]["requestedQuantity"],
			'Raw Material Description': rawDescription,
			'Job Card Status': jobCards[b]["jobcardStatus"]
		}
		wipList.push(wipCard);
	}
	var xls1 = json2xls(wipList);
	dateTimeFormat = curr_date + "-" + curr_month + "-" +d.getFullYear();
	var filename1 = 'D:/TMML/BRiOT-TMML-Machine-Shop-Solution/server/Reports/WIP/Daily-WIP-Report '+ dateTimeFormat +'.xlsx';
	// var filename1 = 'D:/TMML/Reports/WIP/Daily-WIP-Report '+ dateTimeFormat +'.xlsx';
	fs.writeFileSync(filename1, xls1, 'binary',function(err) {
		if (err) {
			console.log('Some error occured - file either not saved or corrupted file saved.');
			sails.log.error("Some error occured - file either not saved or corrupted file saved.");
		} else {
			console.log('It\'s saved!');
		}
	});
	var receiversList = await ReportList.find({
		name : "WIP status of machine shop"
	});
	receiversList = receiversList[0]["email"];
	var mailText = "PFA for WIP status of machine shop Report";
	console.log(mailText);
	var mailOptions = {
    from: "MachineShop_WIP@tatamarcopolo.com", // sender address (who sends)
    // from:"Sagar@briot.in",
    //to: receiversList,
    to:"santosh.adaki@tatamarcopolo.com",
    subject: "WIP status of machine shop Report", // Subject line
    text: mailText,
    attachments :[
    {
    	'filename':'Daily-WIP-Report '+dateTimeFormat+'.xlsx',
    	'path': filename1
    }
    ],
  };
  transporter.sendMail(mailOptions, function(error, info) {
  	if(error){
  		sails.log.error("WIP status of machine shop Report mail not sent",error);
  	} else {
  		sails.log.info('WIP status of machine shop Report Message sent: ' + info.response);
  	}
  });
},


// ------------- Common get Shift Function ------------

shiftFunction: function(updatedAt){
	var shiftDate = updatedAt;
	var TimeStamp = parseInt(updatedAt);
	var dateString = new Date(TimeStamp);
	var CheckShift = (parseInt(dateString.getMonth()) + 1) +"-"+ dateString.getDate() +"-"+ dateString.getFullYear();
	var shiftANameStarTime = "06:00:00";
	var shiftANameEndTime = "14:30:00";
	var shiftANameStarTime1 = CheckShift + " " + shiftANameStarTime;
	var shiftANameEndTime1 = CheckShift + " " + shiftANameEndTime;
	var shiftBNameStarTime = "14:30:00";
	var shiftBNameEndTime = "23:00:00";
	var shiftBNameStarTime1 = CheckShift + " " + shiftBNameStarTime;
	var shiftBNameEndTime1 = CheckShift + " " + shiftBNameEndTime;
	var millis = new Date(shiftANameStarTime1);
	millis=millis.setSeconds(millis.getSeconds());
	var ShiftAStart = millis;
	var millis1 = new Date(shiftANameEndTime1);
	millis1=millis1.setSeconds(millis1.getSeconds());
	var ShiftAEnd =millis1;
	var millisB = new Date(shiftBNameStarTime1);
	millisB=millisB.setSeconds(millisB.getSeconds());
	var ShiftBStart = millisB;
	var millis1B = new Date(shiftBNameEndTime1);
	millis1B=millis1B.setSeconds(millis1B.getSeconds());
	var ShiftBEnd = millis1B;
	var Shift = "";
	console.log("Shift A:",ShiftAStart,ShiftAEnd);
	console.log("Shift B:",ShiftBStart,ShiftBEnd);
	console.log("Shift Date",shiftDate);
	if(shiftDate >=ShiftAStart && shiftDate <= ShiftAEnd)
	{
		Shift = "A";
	}
	else if (shiftDate >= ShiftBStart && shiftDate <= ShiftBEnd)
	{
		Shift = "B";
	}
	else
	{
		Shift = "C";
	}
	return Shift;
},

//------------ Common Get Process Sequence of Job Card ------------

totalProcessesFunction:async function(barcodeSerial) {
	var processSequence1;
	var processSequence2;
	var processSequence3;
	var processSequence4;
	var processSequence5;
	var jobcard = await JobCard.find({
		barcodeSerial : barcodeSerial
	});
	console.log(barcodeSerial);
	if(jobcard != null && jobcard != undefined){
		var productionSchedulePartRelation = await ProductionSchedulePartRelation.find({
			id:jobcard[0]["productionSchedulePartRelationId"]
		});
		if(productionSchedulePartRelation !=null && productionSchedulePartRelation !=undefined){
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
	totalProcesses.push(processes);
	return totalProcesses;
},
};