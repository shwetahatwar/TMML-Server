/**
* MonthlyScheduleController
*
* @description :: Server-side actions for handling incoming requests.
* @help        :: See https://sailsjs.com/docs/concepts/actions
*/
var nodemailer = require ('nodemailer');
module.exports = {
	create: async function(req,res){
		console.log("A:",sails.config.myGlobalVariables.globalOne);
		if(sails.config.myGlobalVariables.globalOne ==0){
			sails.log.info("Monthly Schedule uploading is already going on");
			var selfSignedConfig = {
				host: '128.9.24.24',
				port: 25
			};
			var transporter = nodemailer.createTransport(selfSignedConfig);
			var newEmployeeList = await Employee.find({
				notifyForMachineMaintenance:1
			});
			if(newEmployeeList[0]!=null&&newEmployeeList[0]!=undefined){
				var mailText = "Monthly Schedule upload is already in progress. \n Please wait for sometime to upload your changes.";
				for(var i=0;i<newEmployeeList.length;i++){
					var mailOptions = {
          			from: "MachineShop_WIP@tatamarcopolo.com", // sender address (who sends)
          			to: newEmployeeList[i].email, // list of receivers (who receives)
         			subject: "Monthly Schedule Upload Status", // Subject line
         			text: mailText
         		};
         		transporter.sendMail(mailOptions, function(error, info) {
         			if(error){
         				sails.log.error("Error while Sending monthly schedule mail",error);
         			} else {
         				sails.log.info('Message sent: ' + info.response);
         			}
         		});
         		res.send("Monthly Schedule uploading is already going on");
         	}
         }
     }
     else{
         var selfSignedConfig = {
             host: '128.9.24.24',
             port: 25
         };
         var transporter = nodemailer.createTransport(selfSignedConfig);
         var monthlySchedule = JSON.parse(req.body.monthlySchedule);
         var scheduleName = "Machine Shop Monthly Plan";
         var missingMonthlyParts = [];
         var updatedParts = [];
         scheduleName = scheduleName +" "+ monthlySchedule[0].Year +"-"+ monthlySchedule[0].Month;
         console.log("Line 50 MonthlySchedule", scheduleName);
         var monthlySchedules = await MonthlySchedule.find({
             year:monthlySchedule[0].Year,
             month:monthlySchedule[0].Month,
         });
         var mothlyScheduleId;
         if (monthlySchedules[0] != undefined && monthlySchedules[0] != null) {
             console.log("In If");
             monthlyScheduleId = monthlySchedules[0]["id"];
         }
         else {
             var mothlyScheduleIdCreated = await MonthlySchedule.create({
                 year:monthlySchedule[0].Year,
                 month:monthlySchedule[0].Month,
                 scheduleName:scheduleName
             })
             .fetch();
             console.log(mothlyScheduleIdCreated);
             monthlyScheduleId = mothlyScheduleIdCreated["id"];
         }
         console.log("monthlyScheduleId: ",monthlyScheduleId);
         if(monthlyScheduleId != null && monthlyScheduleId != undefined){
             sails.config.myGlobalVariables.globalOne = 0;
             for(var i=0;i<monthlySchedule.length;i++){
                 var newPartNumber = await PartNumber.find({
                     partNumber:monthlySchedule[i].PartNumber
                 });
                 if(newPartNumber[0]!=null&&newPartNumber[0]!=undefined){
                     var checkPartInMonth = await MonthlySchedulePartRelation.find({
                         monthlyScheduleId:monthlyScheduleId,
                         partNumber:newPartNumber[0]["id"]
                     });
                     if(checkPartInMonth[0] != null && checkPartInMonth[0] != undefined){
                         var checkPartInMonth = await MonthlySchedulePartRelation.update({
                             monthlyScheduleId:monthlyScheduleId,
                             partNumber:newPartNumber[0]["id"]
                         }).set({
                             requiredInMonth:monthlySchedule[i].RequiredInMonth
                         });
                         updatedParts.push(newPartNumber[0]["partNumber"]);
                     }
                     else{
                         MonthlySchedulePartRelation.create({
                             monthlyScheduleId:monthlyScheduleId,
                             partNumber:newPartNumber[0]["id"],
                             description:monthlySchedule[i].Description,
                             UOM:monthlySchedule[i].UOM,
                             proc:monthlySchedule[i].Proc,
                             EP:monthlySchedule[i].EPStoreLocation,
                             issueLoc:monthlySchedule[i].IssueLocChessie,
                             requiredInMonth:monthlySchedule[i].RequiredInMonth,
                             CAT:monthlySchedule[i].CAT
                         })
                         .catch(error=>{console.log(error)});
                     }
                 }
                 else{
                     missingMonthlyParts.push(monthlySchedule[i].PartNumber);
                     console.log('Part Numbers Not found: ', missingMonthlyParts.toString());
                 }
             }
         }
         var newEmployeeList = await Employee.find({
             notifyForMachineMaintenance:1
         });
         // console.log("updatedParts: ",updatedParts); 
         if(newEmployeeList[0]!=null&&newEmployeeList[0]!=undefined){
             var mailText = "Monthly Schedule Uploaded. \n Total Parts Uploaded :- " + monthlySchedule.length +"\n Count of Parts Not Added (Due to Part Number Does not exist):- " + missingMonthlyParts.length +"\n Count of Parts with updated Quantity:- " + updatedParts.length + "\n Part Numbers Data Not Added Due to Part Number Does not exist are as below:- ";
             if(missingMonthlyParts.length ==0){
                 mailText = mailText + " " + "NA";
             }
             else{
                 for(var i=0;i<missingMonthlyParts.length;i++){
                     mailText = mailText + "\n" + missingMonthlyParts[i];
                 }
             }
             mailText = mailText + "\n Part Numbers with Updated Quantity :- ";
             if(updatedParts.length ==0){
                 mailText = mailText + " " + "NA";
             }
             else{
                 for(var i=0;i<updatedParts.length;i++){
                     mailText = mailText + "\n" + updatedParts[i];
                 }
             }
             console.log(mailText);
            //  for(var i=0;i<newEmployeeList.length;i++){
            //      var mailOptions = {
          		// 		from: "MachineShop_WIP@tatamarcopolo.com", // sender address (who sends)
         			// 	to: newEmployeeList[i].email, // list of receivers (who receives)
          		// 		subject: "Monthly Schedule Upload Status", // Subject line
          		// 		text: mailText
          		// 	};
          		// 	transporter.sendMail(mailOptions, function(error, info) {
          		// 		if(error){
          		// 			sails.log.error("Error while Sending monthly schedule mail",error);
          		// 		}
          		// 		else {
          		// 			sails.log.info('Message sent: ' + info.response);
          		// 		}
          		// 	});
          		// }
          	}

          	sails.config.myGlobalVariables.globalOne =1;
          	res.send(mothlyScheduleId);
          }
      }
  };
