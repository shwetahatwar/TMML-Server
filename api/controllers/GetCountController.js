
// import ".../assets/js/BrowserPrint-1.0.4.min.js";

// var BrowserPrint = require('D:\\TMML\\server\\assets\\js\\BrowserPrint-2.0.0.75.min.js');
// var BrowserPrint = require('.../assets/js/BrowserPrint-2.0.0.75.min.js');
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
         var month="";
         if(req.query.year =="01"){
         	month = "Jan"
         }
         if(req.query.year =="02"){
         	month = "Feb"
         }
         if(req.query.year =="03"){
         	month = "Mar"
         }
         if(req.query.year =="04"){
         	month = "Apr"
         }
         if(req.query.year =="05"){
         	month = "May"
         }
         if(req.query.year =="06"){
         	month = "Jun"
         }
         if(req.query.year =="07"){
         	month = "Jul"
         }
         if(req.query.year =="08"){
         	month = "Aug"
         }
         if(req.query.year =="09"){
         	month = "Sep"
         }
         if(req.query.year =="10"){
         	month = "Oct"
         }
         if(req.query.year =="11"){
         	month = "Nov"
         }
         if(req.query.year =="12"){
         	month = "Dec"
         }
		var createdAt = "01-" +month+"-"+req.query.year+"-12:00:00";
		var createdAt1 = "30-"+month+"-"+req.query.year+"-23:59:00";
		console.log(createdAt,createdAt1);
		var dt = new Date(createdAt);
		var createdAtStart=dt.setSeconds( dt.getSeconds());
		console.log(createdAtStart);
		dt = new Date(createdAt1);
		var createdAtEnd=dt.setSeconds(dt.getSeconds());
		console.log(createdAtEnd);
		console.log('monthlySchedule: ', monthlySchedule);
		var sql = ` WITH mytable as ( select * from monthlyschedulepartrelation where monthlyScheduleId = `+monthlySchedule[0]["id"]+`)
		SELECT distinct partNumberId  ,SUM([requestedQuantity]) as sumValue,
		(select top 1 mytable.partNumber from mytable with (nolock) where ( mytable.monthlyScheduleId=`+monthlySchedule[0]["id"]+` AND [TestDatabase].[dbo].[productionschedulepartrelation].partNumberId= mytable.partNumber  ) )
		as partNumber,(select top 1  mytable.requiredInMonth from mytable with (nolock) where ( [TestDatabase].[dbo].[productionschedulepartrelation].partNumberId = mytable.partNumber))
		as requiredInMonth,(select top 1  partNumber from [TestDatabase].[dbo].partnumber with (nolock) where ( [TestDatabase].[dbo].[productionschedulepartrelation].partNumberId =[TestDatabase].[dbo].partnumber.id))
		as PartNumber FROM [TestDatabase].[dbo].[productionschedulepartrelation] inner join mytable as parts on parts.partNumber = [TestDatabase].[dbo].[productionschedulepartrelation].partNumberId where [TestDatabase].[dbo].[productionschedulepartrelation].updatedAt Between `+createdAtStart+` AND `+createdAtEnd+` And isJobCardCreated=1 group by [TestDatabase].[dbo].[productionschedulepartrelation].partNumberId  order by sumValue desc
		`;

		console.log("sql",sql);
		var monthlyData = await sails.sendNativeQuery(sql,[]);

		var resTable = [];
		if(monthlyData["recordset"] != null && monthlyData["recordset"] != undefined){
			for(var i=0; i < monthlyData["recordset"].length; i++){
				if(monthlyData["recordset"][i]["partNumber"] != null && monthlyData["recordset"][i]["partNumber"] != undefined){
					var pushPartDetails={
						partNumberId: monthlyData["recordset"][i]["partNumber"],
						monthlyQuantity: monthlyData["recordset"][i]["requiredInMonth"],
						quantitiesInProduction: monthlyData["recordset"][i]["sumValue"],
						PartNumber:monthlyData["recordset"][i]["PartNumber"]
					}
					resTable.push(pushPartDetails);
				}
			}
		}
		res.send(resTable);
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
		from  [TestDatabase].[dbo].[jobcard] where estimateddate like `+`'`+ req.query.estimatedDate+`%') 
		select row,createdAt from mytable where createdAt=`+`'`+req.query.createdAt+`'`;

		console.log("sql",sql);
		var jobcardData = await sails.sendNativeQuery(sql,[]);
		console.log("jobcardData :",jobcardData);
		var srNo = 1;
		if(jobcardData["recordset"]!=null ||jobcardData["recordset"]!=undefined){
			srNo = jobcardData["recordset"][0]["row"]
		}
		res.send(srNo);
		// await BrowserPrint.getDefaultDevice('printer', await function (printer) {
		// 	console.log("Printer status: ", printer, printer.connection);
		// 	if ((printer == "undefined") && (printer.connection == null)) {
		// 		console.log("No Printer Found");
	 //          // give option to choose printer
  //     }
  //     else {
	 //    	// for (var i = 0; i < data.length; i++) {
	 //    		{
	 //    		// console.log(data[i]);
	 //    		// var name = data[i]["name"];
	 //    		// name = name.replace(/\s/g, '');
	 //    		// var locationType = data[i]["locationType"];
	 //    		// locationType = locationType.replace(/\s/g, '');
	 //    		// console.log(data[i]["barcodeSerial"]);
	 //    		// var barcode = data[i]["barcodeSerial"];
	 //    		// barcode = barcode.replace(/\s/g, '');
	 //    		console.log("\nLABEL PRINT START \n");
	 //    		var printData = "CT~~CD,~CC^~CT~^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR3,3~SD20^JUS^LRN^CI0^XZ^XA^MMT^PW639^LL0959^LS0^FO16,15^GB609,929,4^FS^FO561,20^GB0,921,4^FS^FO135,19^GB0,920,3^FS^FT607,640^A0B,28,28^FH\^FDTata Marcopolo Motors Limited^FS^FT329,700^A0B,56,55^FH\^FDMachine Shop^FS^FT328,872^A0B,56,55^FH\^FDType:^FS^FT220,700^A0B,56,55^FH\^FDBuffer 02^FS^FT219,893^A0B,56,55^FH\^FDName:^FS^FT111,638^A0B,90,88^FH\^FDLocation^FS^FT529,649^A0B,28,28^FH\^FDMA201907221563784277694001^FS^BY3,3,79^FT491,776^BCB,,N,N^FD>:MA>5201907221563784277694001^FS^PQ1,0,1,Y^XZ";
	 //    		printData = printData.replace("Buffer 02", "name");
	 //    		printData = printData.replace("Machine Shop", "locationType");
	 //    		printData = printData.replace("MA>5201907221563784277694001", "barcode");
	 //    		printData = printData.replace("MA201907221563784277694001", "barcode");
	 //    		printer.send(printData);
	 //    		console.log("\nLABEL PRINT END \n");
	 //    	}
	 //    }
	 //  });
	 // var printData = "CT~~CD,~CC^~CT~^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR3,3~SD20^JUS^LRN^CI0^XZ^XA^MMT^PW639^LL0959^LS0^FO16,15^GB609,929,4^FS^FO561,20^GB0,921,4^FS^FO135,19^GB0,920,3^FS^FT607,640^A0B,28,28^FH\^FDTata Marcopolo Motors Limited^FS^FT329,700^A0B,56,55^FH\^FDMachine Shop^FS^FT328,872^A0B,56,55^FH\^FDType:^FS^FT220,700^A0B,56,55^FH\^FDBuffer 02^FS^FT219,893^A0B,56,55^FH\^FDName:^FS^FT111,638^A0B,90,88^FH\^FDLocation^FS^FT529,649^A0B,28,28^FH\^FDMA201907221563784277694001^FS^BY3,3,79^FT491,776^BCB,,N,N^FD>:MA>5201907221563784277694001^FS^PQ1,0,1,Y^XZ";
	 // BrowserPrint.getDefaultDevice('printer', function(printer) {
  //     console.log("Printer status: ", printer, printer.connection);
  //     if((typeof printer != "undefined") && (printer.connection == null))
  //     {
  //       console.log("No Printer Found");
  //       // give option to choose printer
  //     }
  //     else {
  //       console.log(printer.name); // This alert does not pop - why???
  //       console.log("\nLABEL PRINT START \n");
  //       if (printData != null) {
  //         printer.send(printData);
  //       }
  //       console.log("\nLABEL PRINT END \n");
  //     }
  //   },
  //   function(error_response) {
  //     // This alert doesn't pop either
  //     console.log("An error occured while attempting to connect to your Zebra Printer. " +
  //       "You may not have Zebra Browser Print installed, or it may not be running. " +
  //       "Install Zebra Browser Print, or start the Zebra Browser Print Service, and try again.");
  //   });
}
};
