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
	}
};
