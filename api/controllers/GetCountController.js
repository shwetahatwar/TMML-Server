
// import ".../assets/js/BrowserPrint-1.0.4.min.js";

// var BrowserPrint = require('D:\\TMML\\server\\assets\\js\\BrowserPrint-2.0.0.75.min.js');
// var BrowserPrint = require('.../assets/js/BrowserPrint-2.0.0.75.min.js');
var nodemailer = require ('nodemailer');
var json2xls = require('json2xls');
var fs = require('fs');
const net = require('net');
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
			where: {remarks: { '!=' : ['NA', '','OK','okay'] }}
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
		if(req.query.month =="01"){
			month = "Jan"
		}
		if(req.query.month =="02"){
			month = "Feb"
		}
		if(req.query.month =="03"){
			month = "Mar"
		}
		if(req.query.month =="04"){
			month = "Apr"
		}
		if(req.query.month =="05"){
			month = "May"
		}
		if(req.query.month =="06"){
			month = "Jun"
		}
		if(req.query.month =="07"){
			month = "Jul"
		}
		if(req.query.month =="08"){
			month = "Aug"
		}
		if(req.query.month =="09"){
			month = "Sep"
		}
		if(req.query.month =="10"){
			month = "Oct"
		}
		if(req.query.month =="11"){
			month = "Nov"
		}
		if(req.query.month =="12"){
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
		as PartNumber,(select top 1  description from [TestDatabase].[dbo].partnumber with (nolock) where ( [TestDatabase].[dbo].[productionschedulepartrelation].partNumberId =[TestDatabase].[dbo].partnumber.id))
		as PartDesc FROM [TestDatabase].[dbo].[productionschedulepartrelation] inner join mytable as parts on parts.partNumber = [TestDatabase].[dbo].[productionschedulepartrelation].partNumberId where [TestDatabase].[dbo].[productionschedulepartrelation].updatedAt Between `+createdAtStart+` AND `+createdAtEnd+` And isJobCardCreated=1 group by [TestDatabase].[dbo].[productionschedulepartrelation].partNumberId  order by sumValue desc
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
						PartNumber:monthlyData["recordset"][i]["PartNumber"],
						PartDesc:monthlyData["recordset"][i]["PartDesc"]
					}
					resTable.push(pushPartDetails);
				}
			}
		}
		if(req.query.partNumber!=null){
			var searchedPart = resTable.find(p=>p.PartNumber == req.query.partNumber);
			console.log("searchedPart",searchedPart);
			var resTable1 = [];
			resTable1.push(searchedPart);
			res.send(resTable1);
		}
		else{
			res.send(resTable);
		}
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
	},

	netMonthlyReportMail: async function(req, res) {
		var selfSignedConfig = {
			host: '128.9.24.24',
			port: 25
			
		};
		var transporter = nodemailer.createTransport(selfSignedConfig);
		var d = new Date();
		var month = parseInt(d.getMonth()) + 1;
		var year = d.getFullYear();
		var dateTimeFormat;
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
		console.log(year,month);
		var monthlySchedule = await MonthlySchedule.find({
			year:year,
			month:month
		});
		if(month =="01"){
			month = "Jan"
		}
		if(month =="02"){
			month = "Feb"
		}
		if(month =="03"){
			month = "Mar"
		}
		if(month =="04"){
			month = "Apr"
		}
		if(month =="05"){
			month = "May"
		}
		if(month =="06"){
			month = "Jun"
		}
		if(month =="07"){
			month = "Jul"
		}
		if(month =="08"){
			month = "Aug"
		}
		if(month =="09"){
			month = "Sep"
		}
		if(month =="10"){
			month = "Oct"
		}
		if(month =="11"){
			month = "Nov"
		}
		if(month =="12"){
			month = "Dec"
		}
		var createdAt = "01-" +month+"-"+year+"-12:00:00";
		var createdAt1 = "30-"+month+"-"+year+"-23:59:00";
		var dt = new Date(createdAt);
		var createdAtStart=dt.setSeconds( dt.getSeconds());
		console.log(createdAtStart);
		dt = new Date(createdAt1);
		var createdAtEnd=dt.setSeconds(dt.getSeconds());

		console.log('monthlySchedule: ', monthlySchedule);
		var sql = ` WITH mytable as ( select * from monthlyschedulepartrelation where monthlyScheduleId = `+monthlySchedule[0]["id"]+`)
		SELECT distinct partNumberId  ,SUM([requestedQuantity]) as sumValue,
		(select top 1 mytable.partNumber from mytable with (nolock) where ( mytable.monthlyScheduleId=`+monthlySchedule[0]["id"]+` AND [TestDatabase].[dbo].[productionschedulepartrelation].partNumberId= mytable.partNumber  ) )
		as partNumber,(select top 1  mytable.requiredInMonth from mytable with (nolock) where ( [TestDatabase].[dbo].[productionschedulepartrelation].partNumberId = mytable.partNumber))
		as requiredInMonth,(select top 1  partNumber from [TestDatabase].[dbo].partnumber with (nolock) where ( [TestDatabase].[dbo].[productionschedulepartrelation].partNumberId =[TestDatabase].[dbo].partnumber.id))
		as PartNumber,(select top 1  description from [TestDatabase].[dbo].partnumber with (nolock) where ( [TestDatabase].[dbo].[productionschedulepartrelation].partNumberId =[TestDatabase].[dbo].partnumber.id))
		as PartDesc FROM [TestDatabase].[dbo].[productionschedulepartrelation] inner join mytable as parts on parts.partNumber = [TestDatabase].[dbo].[productionschedulepartrelation].partNumberId where [TestDatabase].[dbo].[productionschedulepartrelation].updatedAt Between `+createdAtStart+` AND `+createdAtEnd+` And isJobCardCreated=1 group by [TestDatabase].[dbo].[productionschedulepartrelation].partNumberId  order by sumValue desc
		`;

		console.log("sql",sql);
		var monthlyData = await sails.sendNativeQuery(sql,[]);
		console.log(monthlyData);
		var resTable = [];
		if(monthlyData["recordset"] != null && monthlyData["recordset"] != undefined){
			for(var i=0; i < monthlyData["recordset"].length; i++){
				if(monthlyData["recordset"][i]["partNumber"] != null && monthlyData["recordset"][i]["partNumber"] != undefined){
					var pushPartDetails = {
						'Part Number':monthlyData["recordset"][i]["PartNumber"],
						'Part No Description':monthlyData["recordset"][i]["PartDesc"],
						'Monthly Quantity': monthlyData["recordset"][i]["requiredInMonth"],
						'Quantities In Production': monthlyData["recordset"][i]["sumValue"],
						'Net Monthly Requirement' :parseInt(monthlyData["recordset"][i]["requiredInMonth"]) - parseInt( monthlyData["recordset"][i]["sumValue"])
					}
					resTable.push(pushPartDetails);
				}
			}
		}
		console.log(resTable);
		var xls1 = json2xls(resTable);
		var filename1 = 'D:/TMML/BRiOT-TMML-Machine-Shop-Solution/server/Reports/NetMonthlyReport/Net-Monthly-Report'+ dateTimeFormat +'.xlsx';
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
		var mailText = "PFA for Net Monthly Requirement details";
		console.log(mailText);
		var mailOptions = {
    from: "MachineShop_WIP@tatamarcopolo.com", // sender address (who sends)
    // from:"Sagar@briot.in",
    //to: receiversList,
    to:"santosh.adaki@tatamarcopolo.com",
    subject: "Net Monthly requirement Report", // Subject line
    text: mailText,
    attachments :[
    {
    	'filename':'Net-Monthly-Report '+dateTimeFormat+'.xlsx',
    	'path': filename1
    }
    ],
};
transporter.sendMail(mailOptions, function(error, info) {
	if(error){
		sails.log.error("Net Monthly Requirement report mail not sent",error);
	} else {
		sails.log.info('Message sent: ' + info.response);
	}
});
},

printPartLabel:async function(req,res){
	console.log("PartNumber",req.body.partNumber);
	console.log("qty",req.body.quantity);
	const HOST = '192.168.0.5';
	const PORT = 9100;
	let zpl = `^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR3,3~SD15^JUS^LRN^CI0^XZ
	^XA
	^MMT
	^PW767
	^LL0240
	^LS0
	^BY2,3,28^FT544,106^BCN,,Y,N
	^FD>;12345678>69^FS
	^BY2,3,28^FT279,111^BCN,,Y,N
	^FD>;12345678>69^FS
	^BY2,3,28^FT21,110^BCN,,Y,N
	^FD>;12345678>69^FS
	^PQ1,0,1,Y^XZ`
	zpl = zpl.replace("123456",req.body.partNumber);
    // use net.connect () method to create a TCP client instance
    let client = net.connect(PORT, HOST, ()=>{
    	console.log('Printing labels...');
      // Send data to the server. This method is actually the socket.write () method, because the client parameter is an object on the communication side.
      for (var i=0;i<req.body.quantity;i=+3)
      {
      	client.write(zpl);
      }
      client.end();
  });
    client.on('data', (data)=>{
    	console.log(data.toString());
      // Output the length of the data bytes sent from the client
      console.log('socket.bytesRead is ' + client.bytesRead);
      // After printing the output data, perform the operation of closing the client, which is actually the socket.end () method
      client.end();
  });
    // end event
    client.on('end', ()=>{
    	console.log('client disconnected');
    });
    res.send("Final Location");
}

};
