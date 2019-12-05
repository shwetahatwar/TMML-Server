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
			var startTime =  (parseInt(d.getMonth()) + 1) +"-"+ d.getDate() +"-"+ d.getFullYear()+ " " +"23:00:00";
			var dt = new Date(startTime);
			updatedAtStart=dt.setSeconds( dt.getSeconds());
			var EndTime =  (parseInt(d.getMonth()) + 1) +"-"+ (parseInt(d.getDate()) + 1) +"-"+ d.getFullYear()+ " " +"07:00:00";
			dt = new Date(EndTime);
			updatedAtEnd=dt.setSeconds( dt.getSeconds());
			console.log("TimeStamps: ",updatedAtStart,updatedAtEnd);
		}
		else if(Shift =="D"){
			var startTime =  (parseInt(d.getMonth()) + 1) +"-"+ d.getDate() +"-"+ d.getFullYear()+ " " +"00:00:01";
			var dt = new Date(startTime);
			updatedAtStart=dt.setSeconds( dt.getSeconds());
			var EndTime =  (parseInt(d.getMonth()) + 1) +"-"+ d.getDate() +"-"+ d.getFullYear()+ " " +"23:59:00";
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
				//console.log("Line 170",processSequence.length);
				if(processSequence[0] != null && processSequence[0] != undefined){
					//console.log(processSequence[0]["machineGroupId"]);
					if(processSequence.length == 1){
						var machineGroup = await MachineGroup.find({
							id:processSequence[0]["machineGroupId"]
						});
						//console.log("Line 176",machineGroup);
						// processSequence1 = machineGroup[0]["machineTypeId"];
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							//console.log("Line 182",machineType);
							processSequence1 = machineType[0]["name"];
						}
					}
					else if(processSequence.length == 2){
						var machineGroup = await MachineGroup.find({
							id:processSequence[0]["machineGroupId"]
						});
						//console.log("Line 190",machineGroup);
						// processSequence1 = machineGroup[0]["machineTypeId"];
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence1 = machineType[0]["name"];
						}
						//console.log("line 198", processSequence1);
						var machineGroup = await MachineGroup.find({
							id:processSequence[1]["machineGroupId"]
						});
						// processSequence1 = machineGroup[0]["machineTypeId"];
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
						// processSequence1 = machineGroup[0]["machineTypeId"];
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence1 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[1]["machineGroupId"]
						});
						// processSequence1 = machineGroup[0]["machineTypeId"];
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence2 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[2]["machineGroupId"]
						});
						// processSequence1 = machineGroup[0]["machineTypeId"];
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
						// processSequence1 = machineGroup[0]["machineTypeId"];
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence1 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[1]["machineGroupId"]
						});
						// processSequence1 = machineGroup[0]["machineTypeId"];
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence2 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[2]["machineGroupId"]
						});
						// processSequence1 = machineGroup[0]["machineTypeId"];
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence3 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[3]["machineGroupId"]
						});
						// processSequence1 = machineGroup[0]["machineTypeId"];
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
						// processSequence1 = machineGroup[0]["machineTypeId"];
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence1 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[1]["machineGroupId"]
						});
						// processSequence1 = machineGroup[0]["machineTypeId"];
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence2 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[2]["machineGroupId"]
						});
						// processSequence1 = machineGroup[0]["machineTypeId"];
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence3 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[3]["machineGroupId"]
						});
						// processSequence1 = machineGroup[0]["machineTypeId"];
						if(machineGroup!=null&&machineGroup!=undefined){
							var machineType = await MachineType.find({
								id:machineGroup[0]["machineTypeId"]
							});
							processSequence4 = machineType[0]["name"];
						}
						var machineGroup = await MachineGroup.find({
							id:processSequence[4]["machineGroupId"]
						});
						// processSequence1 = machineGroup[0]["machineTypeId"];
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
		createdAt = createdDate.toDateString();
		var updatedAt = new Date(jobCards[i]["updatedAt"]);
		updatedAt = updatedAt.toDateString();
		var balanceQty = jobCards[i]["requestedQuantity"] - jobCards[i]["actualQuantity"];
		var Adherence = (jobCards[i]["actualQuantity"] / jobCards[i]["requestedQuantity"]) *100;
		if(Shift=="D"){
			var jobCardsList = {
				'Created Date': createdAt,
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
		var xls1 = json2xls(shiftWiseJobCards);
		var filename1 = 'D:/TMML/Reports/PlanVsActualDay/Plan-Vs-Actual-Day '+ dateTimeFormat +'.xlsx';
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
	var filename1 = 'D:/TMML/Reports/ShiftWiseReport/Shift-Wise-Report '+ dateTimeFormat +' Shift'+Shift+'.xlsx';
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

};