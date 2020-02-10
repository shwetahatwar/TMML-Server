/**
 * ProductionSchedulePartRelationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 module.exports = {

 	pendingJobCards: async function(req,res){
 		var limitCount = 100;
 		var skipCount = 0;
 		if (req.query.limit) {
 			limitCount = req.query.limit;
 		}
 		if(req.query.skip){
 			skipCount = req.query.skip;
 		}
 		// SELECT * FROM [dbo].[productionschedulepartrelation] WITH (NOLOCK) WHERE  ( [requestedQuantity]<>0 AND [isJobCardCreated]=0 ) ORDER BY [id] DESC
 		var sql = `SELECT TOP 100 * FROM (SELECT ROW_NUMBER() OVER (ORDER BY [id] DESC ) AS '__rownum__', [createdAt],[updatedAt],[id],[scheduleId],[partNumberId],[requestedQuantity],[scheduleStatus],[inductionDate],[planFor],[createdBy],[estimatedCompletionDate],[isJobCardCreated],[partRemark],
 		(select top 1 partNumber from TestDatabase.dbo.partnumber where TestDatabase.dbo.partnumber.id = TestDatabase.dbo.productionschedulepartrelation.partNumberId) as PartNumber,
 		(select top 1 scheduleDate from TestDatabase.dbo.productionschedule where TestDatabase.dbo.productionschedule.id = TestDatabase.dbo.productionschedulepartrelation.scheduleId) as Date FROM TestDatabase.[dbo].[productionschedulepartrelation] WITH (NOLOCK) WHERE  ( [requestedQuantity]<>0 AND [isJobCardCreated]=0 AND [inductionDate]<>'NA' ) ) __outeroffset__ WHERE __outeroffset__.__rownum__ > `+skipCount+` ORDER BY [id] DESC`;
 		console.log("sql",sql);
 		var pendingJobCardsList = await sails.sendNativeQuery(sql,[]);
 		console.log(pendingJobCardsList);
 		var resTable = [];
 		if(pendingJobCardsList["recordset"] != null && pendingJobCardsList["recordset"] != undefined){
 			for(var i=0; i < pendingJobCardsList["recordset"].length; i++){
 				var pushPartDetails = {
 					'partNumber':pendingJobCardsList["recordset"][i]["PartNumber"],
 					'requestedQuantity':pendingJobCardsList["recordset"][i]["requestedQuantity"],
 					'partRemark':pendingJobCardsList["recordset"][i]["partRemark"],
 					'scheduleDate': pendingJobCardsList["recordset"][i]["Date"],
 					'createdDate': pendingJobCardsList["recordset"][i]["createdAt"],
 					'planFor': pendingJobCardsList["recordset"][i]["planFor"],
 					'inductionDate': pendingJobCardsList["recordset"][i]["inductionDate"]
 				}
 				resTable.push(pushPartDetails);
 			}
 		}
 		res.send(resTable);
 	},
 	
 	pendingJobCardsExport: async function(req,res){
 		var limitCount = 100;
 		var skipCount = 0;
 		if (req.query.limit) {
 			limitCount = req.query.limit;
 		}
 		if(req.query.skip){
 			skipCount = req.query.skip;
 		}
 		// SELECT * FROM [dbo].[productionschedulepartrelation] WITH (NOLOCK) WHERE  ( [requestedQuantity]<>0 AND [isJobCardCreated]=0 ) ORDER BY [id] DESC
 		var sql = `SELECT TOP 100 * FROM (SELECT ROW_NUMBER() OVER (ORDER BY [id] DESC ) AS '__rownum__', [createdAt],[updatedAt],[id],[scheduleId],[partNumberId],[requestedQuantity],[scheduleStatus],[inductionDate],[planFor],[createdBy],[estimatedCompletionDate],[isJobCardCreated],[partRemark],
 		(select top 1 partNumber from TestDatabase.dbo.partnumber where TestDatabase.dbo.partnumber.id = TestDatabase.dbo.productionschedulepartrelation.partNumberId) as PartNumber,
 		(select top 1 scheduleDate from TestDatabase.dbo.productionschedule where TestDatabase.dbo.productionschedule.id = TestDatabase.dbo.productionschedulepartrelation.scheduleId) as Date FROM TestDatabase.[dbo].[productionschedulepartrelation] WITH (NOLOCK) WHERE  ( [requestedQuantity]<>0 AND [isJobCardCreated]=0 AND [inductionDate]<>'NA' AND createdAt Between `+req.query.createdAtStart+` AND `+req.query.createdAtEnd+` ) ) __outeroffset__ WHERE __outeroffset__.__rownum__ > `+skipCount+` ORDER BY [id] DESC`;
 		console.log("sql",sql);
 		var pendingJobCardsList = await sails.sendNativeQuery(sql,[]);
 		console.log(pendingJobCardsList);
 		var resTable = [];
 		if(pendingJobCardsList["recordset"] != null && pendingJobCardsList["recordset"] != undefined){
 			for(var i=0; i < pendingJobCardsList["recordset"].length; i++){
 				var pushPartDetails = {
 					'partNumber':pendingJobCardsList["recordset"][i]["PartNumber"],
 					'requestedQuantity':pendingJobCardsList["recordset"][i]["requestedQuantity"],
 					'partRemark':pendingJobCardsList["recordset"][i]["partRemark"],
 					'scheduleDate': pendingJobCardsList["recordset"][i]["Date"],
 					'createdDate': pendingJobCardsList["recordset"][i]["createdAt"],
 					'planFor': pendingJobCardsList["recordset"][i]["planFor"],
 					'inductionDate': pendingJobCardsList["recordset"][i]["inductionDate"]
 				}
 				resTable.push(pushPartDetails);
 			}
 		}
 		res.send(resTable);
 	}
 };

