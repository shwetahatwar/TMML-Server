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

    var jsonArrayStore =[];
    var a=0;
    var b=0;
    console.log("sapDetails.length:",sapDetails.length);
    for(var j=0;j<sapDetails.length;j++) {
      var sapStoreDetails = await SapTransactionStore.find({
        updatedAt :{ '>=':updatedAtStart,'<=':updatedAtEnd},
        jobCard:sapDetails[j]["jobCard"]
      });
      if(sapStoreDetails[0] != null && sapStoreDetails[0] != undefined){
        a++;
        var tempArryStore = {
          'Plant' : sapDetails[j]["plant"] ,
          'Date' : sapDetails[j]["date"],
          'Material' : sapDetails[j]["material"],
          'JobCard' : sapStoreDetails[0]["jobCard"],
          'UniqueNumber':sapStoreDetails[0]["uniqueNumber"],
          'DocumentNumber313':sapStoreDetails[0]["documentNumber313"],
          'DocumentYear313':sapStoreDetails[0]["documentYear313"],
          'Quantity313':sapStoreDetails[0]["quantity313"],
          'DocumentNumber315':sapStoreDetails[0]["documentNumber315"],
          'DocumentYear315':sapStoreDetails[0]["documentYear315"],
          'Quantity315':sapStoreDetails[0]["quantity315"],
          '313Remarks':sapDetails[j]["remarks"],
          '315Remarks':sapStoreDetails[0]["remarks"],
        }
        jsonArrayStore.push(tempArryStore);
      }
      else{
        b++;
        var tempArryStore = {
          'Plant' : sapDetails[j]["plant"] ,
          'Date' : sapDetails[j]["date"],
          'Material' : sapDetails[j]["material"],
          'JobCard' : sapDetails[j]["jobCard"],
          'UniqueNumber':sapDetails[j]["uniqueNumber"],
          'DocumentNumber313':sapDetails[j]["documentNumber"],
          'DocumentYear313':sapDetails[j]["documentYear"],
          'Quantity313':sapDetails[j]["quantity"],
          'DocumentNumber315':"NA",
          'DocumentYear315':"NA",
          'Quantity315':"NA",
          '313Remarks':sapDetails[j]["remarks"],
          '315Remarks':"NA",
        }
        jsonArrayStore.push(tempArryStore);
      }
  }
  console.log("a:",a);
  console.log("b:",b);
  var xls1 = json2xls(jsonArrayStore);
  var filename1 = 'D:/TMML/BRiOT-TMML-Machine-Shop-Solution/server/Sap-Report/sapDetails '+ dateTimeFormat +'.xlsx';
  fs.writeFileSync(filename1, xls1, 'binary',function(err) {
    if (err) {
      console.log('Some error occured - file either not saved or corrupted file saved.');
      sails.log.error("Some error occured - file either not saved or corrupted file saved.");
    } else {
      console.log('It\'s saved!');
    }
  });

  var mailText = "PFA for SAP details";
  mailText = mailText + "\n 313 Done for " + sapDetails.length +" Parts" ;
  mailText = mailText + "\n 315 Done for " + a +" Parts" ;
  mailText = mailText + "\n 315 Not Done for " + b +" Parts" ;
  console.log(mailText);
  var mailOptions = {
    from: "MachineShop_WIP@tatamarcopolo.com", // sender address (who sends)
    to: "m.inayathulla@tatamarcopolo.com;ashishm@tatamotors.com;santosh.adaki@tatamarcopolo.com;praveen.datar@tatamarcopolo.com;", // list of receivers (who receives)
    // to: "santosh.adaki@tatamarcopolo.com",
    subject: "Sap Detailed Report", // Subject line
    text: mailText,
    attachments :[
      {
        'filename':'sapDetails '+dateTimeFormat+'.xlsx',
        'path': filename1
      }
    ],
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if(error){
      sails.log.error("SAP Daily report mail not sent",error);
    } else {
      sails.log.info('Message sent: ' + info.response);
    }
  });
}
};
