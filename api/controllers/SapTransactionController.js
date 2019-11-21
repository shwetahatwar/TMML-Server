/**
 * SapTransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 var nodemailer = require ('nodemailer');
 var json2xls = require('json2xls');
 var fs = require('fs');
 module.exports = {

 	dailyReport:async function(req,res){
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
 		console.log(dateTimeFormat);
 		var selfSignedConfig = {
 			host: '128.9.24.24',
 			port: 25
 		};
 		var transporter = nodemailer.createTransport(selfSignedConfig);
 		console.log("In Daily Report");
 		var sapDetails = await SapTransaction.find({
 			date:dateTimeFormat
 		});
 		var jsonArray =[];
 		for(var i=0;i<sapDetails.length;i++){
 			var tempArry = {
 				'Plant' : sapDetails[i]["plant"] ,
 				'Date' : sapDetails[i]["date"],
 				'Material' : sapDetails[i]["material"],
 				'jobCard' : sapDetails[i]["jobCard"],
 				'uniqueNumber':sapDetails[i]["uniqueNumber"],
 				'quantity':sapDetails[i]["quantity"],
 				'documentNumber':sapDetails[i]["documentNumber"],
 				'documentYear':sapDetails[i]["documentYear"],
 				'remarks':sapDetails[i]["remarks"],
 			}
 			jsonArray.push(tempArry);
 		}
 		var xls = json2xls(jsonArray);
 		var filename = 'D:/TMML/BRiOT-TMML-Machine-Shop-Solution/server/Sap-Report/sap313Details '+ dateTimeFormat +'.xlsx';
 		fs.writeFileSync(filename, xls, 'binary',function(err) {
 			if (err) {
 				console.log('Some error occured - file either not saved or corrupted file saved.');
 			} else {
 				console.log('It\'s saved!');
 			}
 		});

 		var lastDate = new Date();
 		var day = d.getDate()-1;
 		if(day.toString().length == 1){
 			day = "0" + day
 		}
 		var month = parseInt(d.getMonth()) + 1;
 		month = ""+month;
 		if(month.toString().length == 1){
 			month = "0" + month
 		}
 		var year = d.getFullYear();
 		var startDate= month + "-" + day + "-"+ year + " " +"00:00:00";
 		var endDate= month + "-" + day + "-"+ year + " " +"23:59:59";
 		var dt = new Date(startDate);
 		var updatedAtStart=dt.setSeconds( dt.getSeconds());
 		console.log(updatedAtStart);
 		dt = new Date(endDate);
 		var updatedAtEnd=dt.setSeconds(dt.getSeconds());
 		console.log(updatedAtEnd);
 		var today = new Date();
 		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
 		console.log("time",time);
 		var sapStoreDetails = await SapTransactionStore.find({
 			updatedAt :{ '>=':updatedAtStart,'<=':updatedAtEnd}
 		});

 		var jsonArrayStore =[];
 		for(var i=0;i<sapStoreDetails.length;i++){
 			var tempArryStore = {
 				'jobCard' : sapStoreDetails[i]["jobCard"],
 				'uniqueNumber':sapStoreDetails[i]["uniqueNumber"],
 				'documentNumber313':sapStoreDetails[i]["documentNumber313"],
 				'documentYear313':sapStoreDetails[i]["documentYear313"],
 				'quantity313':sapStoreDetails[i]["quantity313"],
 				'documentNumber315':sapStoreDetails[i]["documentNumber315"],
 				'documentYear315':sapStoreDetails[i]["documentYear315"],
 				'quantity315':sapStoreDetails[i]["quantity315"],
 				'remarks':sapStoreDetails[i]["remarks"],
 			}
 			jsonArrayStore.push(tempArryStore);
 		}
 		var xls1 = json2xls(jsonArrayStore);
 		var filename1 = 'D:/TMML/BRiOT-TMML-Machine-Shop-Solution/server/Sap-Report/sap315Details '+ dateTimeFormat +'.xlsx';
 		fs.writeFileSync(filename1, xls1, 'binary',function(err) {
 			if (err) {
 				console.log('Some error occured - file either not saved or corrupted file saved.');
 			} else {
 				console.log('It\'s saved!');
 			}
 		});

 		var mailText = "PFA for SAP313 & SAP315 details";
 		console.log(mailText);
 		var mailOptions = {
          from: "MachineShop_WIP@tatamarcopolo.com", // sender address (who sends)
          to: "m.inayathulla@tatamarcopolo.com;ashishm@tatamotors.com;santosh.adaki@tatamarcopolo.com;praveen.datar@tatamarcopolo.com;", // list of receivers (who receives)
          subject: "Sap Detailed Report", // Subject line
          text: mailText,
          attachments :[
          {
          	'filename':'sap313Details '+dateTimeFormat+'.xlsx',
          	'path': filename
          },
          {
          	'filename':'sap315Details '+dateTimeFormat+'.xlsx',
          	'path': filename1
          }
          ],
      };
      transporter.sendMail(mailOptions, function(error, info) {
      	if(error){
      		sails.log.error(error);
      	} else {
      		sails.log.info('Message sent: ' + info.response);
      	}
      });
  } 	
};

