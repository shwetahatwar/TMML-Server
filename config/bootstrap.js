/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */
// var ModbusRTU = require("modbus-serial");
// var client = new ModbusRTU();
// var machineStrokes = require('../api/controllers/MachineStrokesController');
var sapPartNumber = require('../api/controllers/SapPartNumberController');
var sapTransaction = require('../api/controllers/SapTransactionController');
var getCountReport = require('../api/controllers/GetCountController');
var dailyReports = require('../api/controllers/ReportsController');
var partNumber = require('../api/controllers/PartNumberController');
var globalVar = 1;
//
// var activeStrockOne = true;
// var activeStrockTwo = true;

module.exports.bootstrap = async function() {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  // console.log("Try Connect");
  setInterval(async function(){
    await sapPartNumber.soapRequestPost();
    await sapPartNumber.soapRequestGet();
  },1800000);



  setInterval(async function(){
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    // console.log("time",time);
    if(time == "0:13"){
      await sapTransaction.dailyReport();
      await getCountReport.netMonthlyReportMail();
      await dailyReports.dailyErrorReport();
    }
    else if(time== "0:17"){
      await dailyReports.dailyVsPlanVsReceivedReport();
      await dailyReports.dailyCreatedJobCardReport();
    }
    else if(time == "14:35"){
      await dailyReports.shiftWiseReport();
    }
    else if(time == "23:10"){
      await dailyReports.shiftWiseReport();
    }
    else if(time == "5:50"){
      await dailyReports.shiftWiseReport();
    }
    else if(time == "0:20"){
      await dailyReports.shiftWiseReport();
    }
    else if(time == "0:30"){
      await dailyReports.machineWiseReport();
    }
    else if(time == "0:37"){
      await dailyReports.partWiseSMHReport();
    }
    else if(time == "0:42"){
      await dailyReports.WIPReport();
    }
     else if(time == "0:48"){
      await dailyReports.dailyPendingJobcardsReport();
    }
    else if(time == "0:50"){
      await dailyReports.dailyNewJobCardsReport();
    }
    else if(time =="0:2"){
      await dailyReports.dailyJobCardsCountMail();
    }
    else if(time =="0:5"){
      await partNumber.dailyUpdatedParts();
    }
  },60000);


  // setInterval(async function(){
  //   var today = new Date();
  //   var time = today.getHours() + ":" + today.getMinutes();
  //   // console.log("time",time);
  //   if(time == "14:35"){
  //     await dailyReports.shiftWiseReport();
  //   }
  //   else if(time == "23:10"){
  //     await dailyReports.shiftWiseReport();
  //   }
  //   else if(time == "7:10"){
  //     await dailyReports.shiftWiseReport();
  //   }
  //   else if(time == "0:20"){
  //     await dailyReports.shiftWiseReport();
  //   }
  // },60000);


  // setInterval(function(){
  //   // SapPartNumber.soapRequestGet();
  //   // SapPartNumber.soapRequestPost();
  // },86400);
  // client.connectTCP("172.25.124.44", { port: 502 },function(err,data){
  //   // console.log(data);
  //   // console.log(err);
  // });
  // client.setID(1);
  // setInterval(function() {
  //   client.readHoldingRegisters(0, 16,async function(err, data) {
  //     if(data){
  //       // console.log(data.data);
  //
  //       if(data.data[0] == 1){
  //         if(activeStrockOne == true){
  //           // var date = (data.data[10]+0x10000).toString(16).substr(-2).toUpperCase() + "-" + (data.data[11]+0x10000).toString(16).substr(-2).toUpperCase() + "-" + (data.data[12]+0x10000).toString(16).substr(-2).toUpperCase();
  //           // var time = (data.data[13]+0x10000).toString(16).substr(-2).toUpperCase() + " : " + (data.data[14]+0x10000).toString(16).substr(-2).toUpperCase();
  //           await machineStrokes.jobstrokes();
  //           // sails.request("http://localhost:1337/iot/jobstrokes");
  //           activeStrockOne = false;
  //           console.log(data.data[0]);
  //         }
  //       }
  //       else{
  //         activeStrockOne = true;
  //       }
  //
  //     }
  //     else if(err){
  //       console.log(err);
  //     }
  //   });
  // }, 1000);

};
