module.exports = {

	getAllEmployeeCount:async function(req,res){
		if(req.query.name ==null){
			var employeeCount = await Employee.count({

			});
		}
		else{
			console.log(req.query.name);
			var employeeCount = await Employee.count({
				name:{
					'contains':req.query.name
				}
			});
		}

		console.log(employeeCount);
		var totalCount=[];
		var requestedData = {
			TotalCount:employeeCount,
		}
		totalCount.push(requestedData);
		res.send(totalCount);
	},

	getAllMachineCount:async function(req,res){
		if(req.query.name ==null){
			var machineCount = await Machine.count({
				status:1
			});
		}
		else{
			var machineCount = await Machine.count({
				name:{
					'contains':req.query.name
				}
			});
		}
		console.log(machineCount);
		var totalCount=[];
		var requestedData = {
			TotalCount:machineCount,
		}
		totalCount.push(requestedData);
		res.send(totalCount);
	},

	getAllLocationCount:async function(req,res){
		if(req.query.name ==null){
			var locationCount = await Location.count({
				locationType: {'!=': 'Machine'}
			});
		}
		else{
			var locationCount = await Location.count({
				name:{
					'contains':req.query.name
				},
				locationType: {'!=': 'Machine'}
			});
		}
		console.log(locationCount);
		var totalCount=[];
		var requestedData = {
			TotalCount:locationCount,
		}
		totalCount.push(requestedData);
		res.send(totalCount);
	},

	getAllRawMaterialCount:async function(req,res){
		if(req.query.rawMaterialNumber ==null){
			var rawMaterialCount = await RawMaterial.count({

			});
		}
		else{
			var rawMaterialCount = await RawMaterial.count({
				rawMaterialNumber:{
					'contains':req.query.rawMaterialNumber
				}
			});
		}
		console.log(rawMaterialCount);
		var totalCount=[];
		var requestedData = {
			TotalCount:rawMaterialCount,
		}
		totalCount.push(requestedData);
		res.send(totalCount);
	},

	getAllPartNumbersCount:async function(req,res){
		if(req.query.partNumber ==null){
			var partNumberCount = await PartNumber.count({
				SMH: {'>': '0'}
			});
		}
		else{
			var partNumberCount = await PartNumber.count({
				partNumber:{
					'contains':req.query.partNumber
				},
				SMH: {'>': '0'}
			});
		}
		console.log(partNumberCount);
		var totalCount=[];
		var requestedData = {
			TotalCount:partNumberCount,
		}
		totalCount.push(requestedData);
		res.send(totalCount);
	},

	getAllPendingPartNumbersCount:async function(req,res){
		if(req.query.partNumber ==null){
			var pendingPartNumberCount = await PartNumber.count({
				SMH:"0"
			});
		}
		else{
			var pendingPartNumberCount = await PartNumber.count({
				partNumber:{
					'contains':req.query.partNumber
				} ,
				SMH:"0"
			});
		}
		console.log(pendingPartNumberCount);
		var totalCount=[];
		var requestedData = {
			TotalCount:pendingPartNumberCount,
		}
		totalCount.push(requestedData);
		res.send(totalCount);
	},

	getAllProductionScheduleCount:async function(req,res){
		if(req.query.productionScheduleId ==null){
			var productionScheduleCount = await ProductionSchedule.count({

			});
		}
		else{
			var productionScheduleCount = await ProductionSchedule.count({
				productionScheduleId:{
					'contains':req.query.productionScheduleId
				}
			});
		}
		console.log(productionScheduleCount);
		var totalCount=[];
		var requestedData = {
			TotalCount:productionScheduleCount,
		}
		totalCount.push(requestedData);
		res.send(totalCount);
	},

	getAllMonthlyScheduleCount:async function(req,res){
		if(req.query.scheduleName ==null){
			var monthlyScheduleCount = await MonthlySchedule.count({

			});
		}
		else{
			var monthlyScheduleCount = await MonthlySchedule.count({
				scheduleName:{
					'contains':req.query.scheduleName
				}
			});
		}
		console.log(monthlyScheduleCount);
		var totalCount=[];
		var requestedData = {
			TotalCount:monthlyScheduleCount,
		}
		totalCount.push(requestedData);
		res.send(totalCount);
	},

	getAllDailyScheduleIdCount:async function(req,res){
		var productionScheduleCount = await ProductionSchedulePartRelation.count({
			scheduleId: req.query.id
		});

		console.log(productionScheduleCount);
		var totalCount=[];
		var requestedData = {
			TotalCount:productionScheduleCount,
		}
		totalCount.push(requestedData);
		res.send(totalCount);
	},

	getAllMonthlyScheduleIdCount:async function(req,res){
		var monthlyScheduleCount = await MonthlySchedulePartRelation.count({
			monthlyScheduleId : req.query.id
		});

		console.log(monthlyScheduleCount);
		var totalCount=[];
		var requestedData = {
			TotalCount:monthlyScheduleCount,
		}
		totalCount.push(requestedData);
		res.send(totalCount);
	},

	getLogisticsCount:async function(req,res){
		if(req.query.barcodeSerial == null){
			var jobCardCount = await Joblocationrelation.count({
				processStatus: { '!=' : ['Complete', 'Final Location'] }
			});
		}
		else{
			var jobCardCount = await Joblocationrelation.count({
				barcodeSerial:{
					'contains':req.query.barcodeSerial
				},
				processStatus: { '!=' : ['Complete', 'Final Location'] }
			});
		}
		console.log(jobCardCount);
		var totalCount=[];
		var requestedData = {
			TotalCount:jobCardCount,
		}
		totalCount.push(requestedData);
		res.send(totalCount);
	},

	getProcessDataFeedCount:async function(req,res){
		if(req.query.barcodeSerial == null){
			var jobCardCount = await JobProcessSequenceRelation.count({
				processStatus:'Start'
			});
		}
		else{
			var jobCardCount = await Joblocationrelation.count({
				barcodeSerial:{
					'contains':req.query.barcodeSerial
				},
				processStatus:'Start'
			});
		}
		console.log(jobCardCount);
		var totalCount=[];
		var requestedData = {
			TotalCount:jobCardCount,
		}
		totalCount.push(requestedData);
		res.send(totalCount);
	},

	getAllRerouteCount:async function(req,res){
		if(req.query.barcodeSerial == null){
			var ReroutedJobCardCount = await JobProcessSequenceRelation.count({
				processStatus: {'!=': 'FinalLocation'}
			});
		}
		else{
			var ReroutedJobCardCount = await JobProcessSequenceRelation.count({
				barcodeSerial:{
					'contains':req.query.barcodeSerial
				} ,
				processStatus: {'!=': 'FinalLocation'}
			});
		}
		console.log(ReroutedJobCardCount);
		var totalCount=[];
		var requestedData = {
			TotalCount:ReroutedJobCardCount,
		}
		totalCount.push(requestedData);
		res.send(totalCount);
	},

	getSapDataCount:async function(req,res){
		if(req.query.barcodeSerial == null){
			var jobCardCount = await SapTransaction.count({

			});
		}
		else{
			var jobCardCount = await SapTransaction.count({
				barcodeSerial:{
					'contains':req.query.barcodeSerial
				}
			});
		}
		console.log(jobCardCount);
		var totalCount=[];
		var requestedData = {
			TotalCount:jobCardCount,
		}
		totalCount.push(requestedData);
		res.send(totalCount);
	},

	getUserCount:async function(req,res){
		if(req.query.userName == null){
			var userCount = await User.count({

			});
		}
		else{
			var userCount = await User.count({
				userName:{
					'contains':req.query.userName
				}
			});
		}
		console.log(userCount);
		var totalCount=[];
		var requestedData = {
			TotalCount:userCount,
		}
		totalCount.push(requestedData);
		res.send(totalCount);
	},

	getInProgressJobCount:async function(req,res){
		var dt = new Date();
		dt.setSeconds(dt.getSeconds() + 0);
		var estimatedDate = dt.toString();
		estimatedDate = estimatedDate.substr(0,15);
		console.log(estimatedDate);
		if(req.query.barcodeSerial == null){
			var jobCardCount = await JobCard.count({
				jobcardStatus:"In Progress",
				estimatedDate:{
					'contains':estimatedDate
				}
			});
		}
		else{
			var jobCardCount = await JobCard.count({
				barcodeSerial:{
					'contains':req.query.barcodeSerial
				},
				jobcardStatus:"In Progress",
				estimatedDate:{
					'contains':estimatedDate
				}
			});
		}
		var jobCardTotalCount = await JobCard.count({
			jobcardStatus:"In Progress"
		});
		console.log(jobCardCount);
		var totalCount=[];
		var FinalCount=[];
		var requestedData = {
			TotalCount:jobCardCount,
		}
		var finalData = {
			FinalCount:jobCardTotalCount,
		}
		totalCount.push(requestedData);
		totalCount.push(finalData);
		res.send(totalCount);
	},

	getCompletedJobCount:async function(req,res){
		var dt = new Date();
		dt.setSeconds(dt.getSeconds() + 0);
		var estimatedDate = dt.toString();
		estimatedDate = estimatedDate.substr(0,15);
		console.log(estimatedDate);
		if(req.query.barcodeSerial == null){
			var jobCardCount = await JobCard.count({
				jobcardStatus:"Completed",
				estimatedDate:{
					'contains':estimatedDate
				}
			});
		}
		else{
			var jobCardCount = await JobCard.count({
				barcodeSerial:{
					'contains':req.query.barcodeSerial
				},
				jobcardStatus:"Completed",
				estimatedDate:{
					'contains':estimatedDate
				}
			});
		}
		var jobCardTotalCount = await JobCard.count({
			jobcardStatus:"Completed"
		});
		console.log(jobCardCount);
		var totalCount=[];
		var FinalCount=[];
		var requestedData = {
			TotalCount:jobCardCount,
		}
		var finalData = {
			FinalCount:jobCardTotalCount,
		}
		totalCount.push(requestedData);
		totalCount.push(finalData);
		res.send(totalCount);
	},

	getJobCardSequence : async function(req,res){
		var processSequence1;
		var processSequence2;
		var processSequence3;
		var processSequence4;
		var processSequence5;
		var jobcard = await JobCard.find({
			barcodeSerial : req.query.barcodeSerial
		});
		//console.log(jobcard);
		if(jobcard!=null&&jobcard!=undefined){
			var productionSchedulePartRelation = await ProductionSchedulePartRelation.find({
				id:jobcard[0]["productionSchedulePartRelationId"]
			});
			//console.log(productionSchedulePartRelation);
			if(productionSchedulePartRelation !=null && productionSchedulePartRelation !=undefined){
				var processSequence = await ProcessSequence.find({
					partId:productionSchedulePartRelation[0]["partNumberId"],
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
		res.send(totalProcesses);
	},

	getAllCompletedCount:async function(req,res){
		var dataCount = await JobProcessSequenceRelation.count({
			or:[{processStatus:"Completed"},{processStatus:"FinalLocation"}]
		});
		console.log(dataCount);
		var totalCount=[];
		var requestedData = {
			TotalCount:dataCount,
		}
		totalCount.push(requestedData);
		res.send(totalCount);
	},

	getAllErrorPartCount:async function(req,res){
		var dataCount = await PartNumber.count({
			remarks: { '!=' : ['NA', ''] }
		});
		console.log(dataCount);
		var totalCount=[];
		var requestedData = {
			TotalCount:dataCount,
		}
		totalCount.push(requestedData);
		res.send(totalCount);
	},

	getErrorReport:async function(req,res){
		var limitCount = 100;
		var skipCount = 0;
		if (req.query.limit) {
			limitCount = req.query.limit;
		}
		if(req.query.skip){
			skipCount = req.query.skip;
		}
		var parts = await PartNumber.find({
			where: {remarks: { '!=' : ['NA', ''] }}
			,limit:limitCount,skip:skipCount,sort:[{ id: 'DESC'}]
		});
		console.log(parts.length)
		res.send(parts);
		var d = new Date();
		sails.log.info("Error Report Download : "+d+"",parts);
	},

	dailyMonthlyPartReport: async function(req,res){

		var monthlySchedule = await MonthlySchedule.find({
			year:req.query.year,
			month:req.query.month
		});

		console.log('monthlySchedule: ', monthlySchedule);

		var partNumberIdToBeSearched = await PartNumber.find({
			partNumber:req.query.partNumber
		});

		console.log('partNumber id: ', partNumberIdToBeSearched);

		if(monthlySchedule[0] != undefined && monthlySchedule.length > 0 && monthlySchedule[0] != null){
			if(partNumberIdToBeSearched[0] != undefined && partNumberIdToBeSearched.length > 0 && partNumberIdToBeSearched[0] != null){
				console.log('monthlySchedulePartNumbers: ', monthlySchedule[0]["id"]);
				var monthlySchedulePartNumbers = await MonthlySchedulePartRelation.find({
					monthlyScheduleId:monthlySchedule[0]["id"],
					partNumber:partNumberIdToBeSearched[0]["id"]
				}).populate('partNumber');
			}
		}

		console.log("MonthlySchedulePartRelation: ", monthlySchedulePartNumbers);

		// console.log(monthlySchedulePartNumbers.length);
		if(monthlySchedulePartNumbers[0] != null && monthlySchedulePartNumbers[0] != undefined){
			console.log('monthly schedule id: ', monthlySchedule[0]["id"]);
			var dailySchedule = await ProductionSchedule.find({
				monthlyScheduleId:monthlySchedule[0]["id"],
				remarks:{ '!=' :''}
			});
		}
		// console.log(dailySchedule.length);
		var resTable = [];
		if(monthlySchedulePartNumbers != null && monthlySchedulePartNumbers != undefined){
			for(var i=0; i < monthlySchedulePartNumbers.length; i++){
				var partNumberQuantity = 0;
				if(dailySchedule[0] != null && dailySchedule[0] != undefined){
					for(var j=0;j<dailySchedule.length;j++){
						// console.log(dailySchedule[j]["id"]);
						// console.log(monthlySchedulePartNumbers[i]["partNumber"]);
						var dailySchedulePartNumbers = await ProductionSchedulePartRelation.find({
							scheduleId:dailySchedule[j]["id"],
							partNumberId:monthlySchedulePartNumbers[i]["partNumber"]['id']
						});
						// console.log(dailySchedulePartNumbers);
						if(dailySchedulePartNumbers[0]!=null && dailySchedulePartNumbers[0] != undefined){
							partNumberQuantity = partNumberQuantity + dailySchedulePartNumbers[0]["requestedQuantity"];
						}
					}
					console.log('Part Number: ', monthlySchedulePartNumbers[i]);
					var pushPartDetails={
						partNumberId: monthlySchedulePartNumbers[i]["partNumber"]['id'],
						monthlyQuantity:monthlySchedulePartNumbers[i]["requiredInMonth"],
						quantitiesInProduction:partNumberQuantity,
						partNumber:monthlySchedulePartNumbers[i]["partNumber"]['partNumber'],
					}
					// var pushPartDetails=[monthlySchedulePartNumbers[i]["partNumber"],monthlySchedulePartNumbers[i]["requiredInMonth"],partNumberQuantity];
					resTable.push(pushPartDetails);
					// resTable.push("Part Number: " + monthlySchedulePartNumbers[i]["partNumber"],"Monthly Quantity: "+monthlySchedulePartNumbers[i]["requiredInMonth"],"Completed Quantity: "+partNumberQuantity);
				}
			}
		}
		console.log(resTable);
		res.send(resTable);
		var d = new Date();
    sails.log.info("Daily Monthly Report Downloaded on: "+d+"",resTable);
	},

	getPPartRelation: async function(req, res) {
		var result = await ProductionSchedulePartRelation.find({
			'isJobCardCreated': req.query['isJobCardCreated'],
			'scheduleId':req.query['scheduleId'],
		}).populate('jobcard')
		.populate('scheduleId')
		.populate('partNumberId').limit(2000);
		res.send(result);
	},

	getSrNo: async function(req, res) {
		// var sql = `SELECT createdAt,ROW_NUMBER() OVER(ORDER BY id ASC) AS Row# FROM [TestDatabase].[dbo].[jobcard] where estimatedDate like `+`'`+ req.query.estimatedDate+`%'`;
		var sql = ` WITH mytable as 
		(select createdAt,ROW_NUMBER() over (order by createdAt) as 'row'
		from  [TestDatabase26112019].[dbo].[jobcard] where estimateddate like `+`'`+ req.query.estimatedDate+`%') 
		select row,createdAt from mytable where createdAt=`+`'`+req.query.createdAt+`'`;

		console.log("sql",sql);
		var jobcardData = await sails.sendNativeQuery(sql,[]);
		console.log("jobcardData :",jobcardData);
		var srNo = 1;
		if(jobcardData["recordset"]!=null ||jobcardData["recordset"]!=undefined){
			srNo = jobcardData["recordset"][0]["row"]
		}
		res.send(srNo);
		
	}
};
