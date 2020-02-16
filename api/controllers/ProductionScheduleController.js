/**
* ProductionScheduleController
*
* @description :: Server-side actions for handling incoming requests.
* @help        :: See https://sailsjs.com/docs/concepts/actions
*/
var nodemailer = require ('nodemailer'); 
var json2xls = require('json2xls');
var fs = require('fs');

module.exports = {
  create: async function (req, res) {
    var newproductionScheduleId = await ProductionSchedule.create({
      productionScheduleId: req.body.productionScheduleId,
      estimatedCompletionDate: req.body.estimatedCompletionDate,
      actualCompletionDate: req.body.actualCompletionDate,
      status: req.body.status,
      scheduleType: req.body.scheduleType,
      remarks: req.body.remarks,
      scheduleStatus: req.body.scheduleStatus
    })
    .fetch()
    .catch(error =>
      console.log(error));
    console.log(newproductionScheduleId["id"]);
    for (var i = 0; i < req.body.partMaster.length; i++) {
      console.log(req.body.partMaster[i].partNumberId);
      var newPartNumber = await PartNumber.findOne({ partNumber: req.body.partMaster[i].partNumberId,jcCreateStatus:1 });
      console.log(newPartNumber);
      if (newPartNumber != null && newPartNumber != undefined) {
        await ProductionSchedulePartRelation.create({
          scheduleId: newproductionScheduleId["id"],
          partNumberId: newPartNumber["id"],
          requestedQuantity: req.body.partMaster[i].requestedQuantity,
          estimatedCompletionDate: req.body.partMaster[i].estimatedCompletionDate,
          isJobCardCreated: req.body.partMaster[i].isJobCardCreated,
          partRemark: req.body.partMaster[i].partRemark
        })
        .then()
        .catch(error => console.log(error));
      }
    }
    res.status(200).send(newproductionScheduleId);
  },

  dailyUpload: async function(req,res){
    var selfSignedConfig = {
      host: '128.9.24.24',
      port: 25
    };
    var mailText = "Daily Schedule Uploaded.\n Parts Not Added due to Jobcard block provision: ";
    var transporter = nodemailer.createTransport(selfSignedConfig);
      // console.log(req.body.dailySchedule[0].getOwnPropertyNames);
      var dailySchedule = JSON.parse(req.body.dailySchedule);
      console.log("Daily Upload Data",dailySchedule);
      var deviationPartList = [];
      var notInMonthlySchedulePartList = [];
      if(req.body.actions=="New"){
        var obj=Object.getOwnPropertyNames(dailySchedule[0]);
        console.log("obj",obj);
        var day1=obj[2];
        var day2=obj[5];
        var day3=obj[8];
        var day4=obj[11];
        var day5=obj[14];
        console.log(day1);
        console.log(dailySchedule[0][day1],dailySchedule[0][day2],dailySchedule[0][day2],dailySchedule[0][day4],dailySchedule[0][day5]);
        var day;
        for(var counter=0;counter<5;counter++)
          if(counter==0){
            day = day1;
            var checkProductionSchedule = "Machine Shop Daily Plan " +day;
            var getProductionScheduleId = await ProductionSchedule.find({
              where: { productionScheduleId: { contains: checkProductionSchedule } },
              sort: [{ id: 'DESC'}]
            });
            var postProductionScheduleId;
            if(getProductionScheduleId[0]!=null&&getProductionScheduleId[0]!=undefined){
              console.log(getProductionScheduleId[0]);
              var latestProductionScheduleId = getProductionScheduleId[0]["productionScheduleId"];
              latestProductionScheduleId = latestProductionScheduleId.substr(35,3);
              latestProductionScheduleId = parseInt(latestProductionScheduleId, 10) +1;
              if(latestProductionScheduleId.toString().length == 1){
                latestProductionScheduleId = "00" + latestProductionScheduleId;
              }
              else if(latestProductionScheduleId.toString().length == 2){
                latestProductionScheduleId = "0" + latestProductionScheduleId;
              }
              postProductionScheduleId = "Machine Shop Daily Plan " +day+"-"+latestProductionScheduleId;
              console.log(latestProductionScheduleId);
            }
            else{
              postProductionScheduleId = "Machine Shop Daily Plan " +day+"-001"
            }
            var currentMonth = day;
            var currentYear = day;
            currentMonth = currentMonth.substr(3,2);
            currentYear = currentYear.substr(6,4);
            console.log(currentYear,currentMonth);
            var getMonthlyScheduleId = await MonthlySchedule.find({
              year:currentYear,
              month:currentMonth
            });
            console.log(getMonthlyScheduleId);
            if(getMonthlyScheduleId[0]!=null&&getMonthlyScheduleId[0]!=undefined){
              var newproductionScheduleId = await ProductionSchedule.create({
                productionScheduleId: postProductionScheduleId,
                estimatedCompletionDate: req.body.estimatedCompletionDate,
                actualCompletionDate: req.body.actualCompletionDate,
                status: 1,
                scheduleType: "Scheduled",
                remarks: dailySchedule[0].remarks,
                scheduleStatus: "New",
                scheduleDate:day1,
                monthlyScheduleId:getMonthlyScheduleId[0]["id"]
              })
              .fetch()
              .catch(error => sails.log.error("Some error occured - file either not saved or corrupted file saved."));

              for(var i=0;i<dailySchedule.length;i++){
                console.log(dailySchedule[i]["partnumber"]);
                console.log(dailySchedule[i]["inductionDate1"]);
                var newPartNumberId = await PartNumber.find({
                  partNumber:dailySchedule[i]["partnumber"],
                  jcCreateStatus:1
                });
                console.log("Line 110", newPartNumberId);
                var newPartNumberIdStatus;
                if(newPartNumberId[0] ==null || newPartNumberId[0]==undefined){
                  newPartNumberIdStatus = await PartNumber.find({
                    partNumber:dailySchedule[i]["partnumber"],
                    jcCreateStatus:0
                  });
                  console.log("Line 132", newPartNumberIdStatus);
                  if(newPartNumberIdStatus[0] ==null || newPartNumberIdStatus[0] ==undefined){
                    console.log("Inside if");
                  }
                  else{
                    mailText = mailText + "\n" + newPartNumberIdStatus[0]["partNumber"] +"\n";
                  }
                }
                var canAddQty = 0;
                if(dailySchedule[i]["monthlyQty"] ==0){
                  var part = {
                    "Part Number":dailySchedule[i]["partnumber"]
                  }
                  notInMonthlySchedulePartList.push(part);
                }
                else{
                  canAddQty = parseInt(dailySchedule[i]["monthlyQty"]) - parseInt(dailySchedule[i]["producedQty"]);
                }//console.log("canAddQty1 :",canAddQty);
                var daviationQty = 0;
                var requestedQty = 0;
                var originalQuantity = 0;
                console.log("Can Add")
                if(canAddQty < dailySchedule[i][day1] && canAddQty > 0){
                  originalQuantity = dailySchedule[i][day1];
                  daviationQty = dailySchedule[i][day1] - canAddQty;
                  requestedQty = canAddQty;
                }
                else if(canAddQty > dailySchedule[i][day1]){
                  requestedQty = dailySchedule[i][day1];
                }
                else{
                  daviationQty = dailySchedule[i][day1];
                  originalQuantity = dailySchedule[i][day1];
                }
                //console.log("requestedQty",requestedQty);
               // console.log("part",newPartNumberId);
               if(requestedQty != 0 && requestedQty != undefined){
                 if(newPartNumberId[0]!=null && newPartNumberId[0]!=undefined){
                   await ProductionSchedulePartRelation.create({
                     scheduleId: newproductionScheduleId["id"],
                     partNumberId: newPartNumberId[0]["id"],
                     requestedQuantity: requestedQty,
                     estimatedCompletionDate: 0,
                     isJobCardCreated: false,
                     partRemark: dailySchedule[i].remarks,
                     scheduleStatus:"New",
                     inductionDate:dailySchedule[i]["inductionDate1"],
                     planFor:dailySchedule[i]["planFor1"]
                   })
                   .then()
                   .catch(error => console.log(error));
                 }
               }

               if(daviationQty != 0 && daviationQty != undefined){
                 if(newPartNumberId[0]!=null && newPartNumberId[0]!=undefined){
                   var singleDeviationPart = {
                     "Production Schedule":newproductionScheduleId["productionScheduleId"],
                     "Part Number": newPartNumberId[0]["partNumber"],
                     "Requested Quantity": originalQuantity,
                     "Produced Quantity": dailySchedule[i]["producedQty"],
                     "Deviation Quantity": daviationQty,
                     "Monthly Quantity": dailySchedule[i]["monthlyQty"],
                     "Induction Date":dailySchedule[i]["inductionDate1"],
                     "Plan For":dailySchedule[i]["planFor1"]
                   }
                 }
                 deviationPartList.push(singleDeviationPart);
                 if(newPartNumberId[0]!=null && newPartNumberId[0]!=undefined){
                   await Deviation.create({
                     scheduleId: newproductionScheduleId["id"],
                     partNumberId: newPartNumberId[0]["id"],
                     originalQuantity: originalQuantity,
                     deviationQuantity: daviationQty,
                     inductionDate:dailySchedule[i]["inductionDate1"],
                     planFor:dailySchedule[i]["planFor1"]
                   })
                   .then()
                   .catch(error => console.log(error));
                 }
               }
             }
           }
           else{
            // res.send("Monthly Schedule Not Found");
          }
        }
        else if(counter == 1){
          day = day2;
          var checkProductionSchedule = "Machine Shop Daily Plan " +day;
          var getProductionScheduleId = await ProductionSchedule.find({
            where: { productionScheduleId: { contains: checkProductionSchedule } },
            sort: [{ id: 'DESC'}]
          });
          var postProductionScheduleId
          if(getProductionScheduleId[0]!=null&&getProductionScheduleId[0]!=undefined){
            var latestProductionScheduleId = getProductionScheduleId[0]["productionScheduleId"];
            latestProductionScheduleId = latestProductionScheduleId.substr(35,3);
            latestProductionScheduleId = parseInt(latestProductionScheduleId, 10) +1;
            if(latestProductionScheduleId.toString().length == 1){
              latestProductionScheduleId = "00" + latestProductionScheduleId;
            }
            else if(latestProductionScheduleId.toString().length == 2){
              latestProductionScheduleId = "0" + latestProductionScheduleId;
            }
            postProductionScheduleId = "Machine Shop Daily Plan " +day+"-"+latestProductionScheduleId;
            console.log(latestProductionScheduleId);
          }
          else{
            postProductionScheduleId = "Machine Shop Daily Plan " +day+"-001"
          }
          var currentMonth = day;
          var currentYear = day;
          currentMonth = currentMonth.substr(3,2);
          currentYear = currentYear.substr(6,4);
          console.log(currentYear,currentMonth);
          var getMonthlyScheduleId = await MonthlySchedule.find({
            year:currentYear,
            month:currentMonth
          });
          console.log(getMonthlyScheduleId);
          if(getMonthlyScheduleId[0]!=null&&getMonthlyScheduleId[0]!=undefined){
            var newproductionScheduleId = await ProductionSchedule.create({
              productionScheduleId: postProductionScheduleId,
              estimatedCompletionDate: req.body.estimatedCompletionDate,
              actualCompletionDate: req.body.actualCompletionDate,
              status: 1,
              scheduleType: "Scheduled",
              remarks: "",
              scheduleStatus: "New",
              scheduleDate:day1,
              monthlyScheduleId:getMonthlyScheduleId[0]["id"]
            })
            .fetch()
            .catch(error => console.log(error));
            for(var i=0;i<dailySchedule.length;i++){
              var newPartNumberId = await PartNumber.find({
                partNumber:dailySchedule[i]["partnumber"],
                jcCreateStatus:1
              });
              var canAddQty = parseInt(dailySchedule[i]["monthlyQty"]) - (parseInt(dailySchedule[i]["producedQty"]) + parseInt(dailySchedule[i][day1]));
              console.log("canAddQty2 :",canAddQty);
              var daviationQty = 0;
              var requestedQty = 0;
              var originalQuantity = 0;
              if(canAddQty < dailySchedule[i][day2] && canAddQty > 0){
                originalQuantity = dailySchedule[i][day2];
                daviationQty = dailySchedule[i][day2] - canAddQty;
                requestedQty = canAddQty;
              }
              else if(canAddQty > dailySchedule[i][day2]){
                requestedQty = dailySchedule[i][day2];
              }
              else{
                daviationQty = dailySchedule[i][day2];
                originalQuantity = dailySchedule[i][day2];
              }
              //console.log("requestedQty",requestedQty);
             //console.log("daviationQty",daviationQty);
             if(requestedQty != 0 && requestedQty != undefined){
               if(newPartNumberId[0]!=null && newPartNumberId[0]!=undefined){
                 await ProductionSchedulePartRelation.create({
                   scheduleId: newproductionScheduleId["id"],
                   partNumberId: newPartNumberId[0]["id"],
                   requestedQuantity: requestedQty,
                   estimatedCompletionDate: 0,
                   isJobCardCreated: false,
                   partRemark: dailySchedule[i].remarks,
                   scheduleStatus:"New",
                   inductionDate:dailySchedule[i]["inductionDate2"],
                   planFor:dailySchedule[i]["planFor2"]
                 })
                 .then()
                 .catch(error => console.log(error));
               }
             }
             if(daviationQty != 0 && daviationQty != undefined){
               if(newPartNumberId[0]!=null && newPartNumberId[0]!=undefined){
                 var singleDeviationPart = {
                   "Production Schedule":newproductionScheduleId["productionScheduleId"],
                   "Part Number": newPartNumberId[0]["partNumber"],
                   "Requested Quantity": originalQuantity,
                   "Produced Quantity": dailySchedule[i]["producedQty"],
                   "Deviation Quantity": daviationQty,
                   "Monthly Quantity": dailySchedule[i]["monthlyQty"],
                   "Induction Date":dailySchedule[i]["inductionDate1"],
                   "Plan For":dailySchedule[i]["planFor1"]
                 }
                 deviationPartList.push(singleDeviationPart);
                 await Deviation.create({
                   scheduleId: newproductionScheduleId["id"],
                   partNumberId: newPartNumberId[0]["id"],
                   originalQuantity: originalQuantity,
                   deviationQuantity: daviationQty,
                   inductionDate:dailySchedule[i]["inductionDate2"],
                   planFor:dailySchedule[i]["planFor2"]
                 })
                 .then()
                 .catch(error => console.log(error));
               }
             }
           }
         }
       }
       else if(counter == 2){
         day = day3;
         var checkProductionSchedule = "Machine Shop Daily Plan " +day;
         var getProductionScheduleId = await ProductionSchedule.find({
           where: { productionScheduleId: { contains: checkProductionSchedule } },
           sort: [{ id: 'DESC'}]
         });
         var postProductionScheduleId
         if(getProductionScheduleId[0]!=null&&getProductionScheduleId[0]!=undefined){
           var latestProductionScheduleId = getProductionScheduleId[0]["productionScheduleId"];
           latestProductionScheduleId = latestProductionScheduleId.substr(35,3);
           latestProductionScheduleId = parseInt(latestProductionScheduleId, 10) +1;
           if(latestProductionScheduleId.toString().length == 1){
             latestProductionScheduleId = "00" + latestProductionScheduleId;
           }
           else if(latestProductionScheduleId.toString().length == 2){
             latestProductionScheduleId = "0" + latestProductionScheduleId;
           }
           postProductionScheduleId = "Machine Shop Daily Plan " +day+"-"+latestProductionScheduleId;
           console.log(latestProductionScheduleId);
         }
         else{
           postProductionScheduleId = "Machine Shop Daily Plan " +day+"-001"
         }
         var currentMonth = day;
         var currentYear = day;
         currentMonth = currentMonth.substr(3,2);
         currentYear = currentYear.substr(6,4);
         console.log(currentYear,currentMonth);
         var getMonthlyScheduleId = await MonthlySchedule.find({
           year:currentYear,
           month:currentMonth
         });
         console.log(getMonthlyScheduleId);
         if(getMonthlyScheduleId[0]!=null&&getMonthlyScheduleId[0]!=undefined){
           var newproductionScheduleId = await ProductionSchedule.create({
             productionScheduleId: postProductionScheduleId,
             estimatedCompletionDate: req.body.estimatedCompletionDate,
             actualCompletionDate: req.body.actualCompletionDate,
             status: 1,
             scheduleType: "Scheduled",
             remarks: "",
             scheduleStatus: "New",
             scheduleDate:day1,
             monthlyScheduleId:getMonthlyScheduleId[0]["id"]
           })
           .fetch()
           .catch(error => console.log(error));
           for(var i=0;i<dailySchedule.length;i++){
             var newPartNumberId = await PartNumber.find({
               partNumber:dailySchedule[i]["partnumber"],
               jcCreateStatus:1
             });
             var canAddQty = parseInt(dailySchedule[i]["monthlyQty"]) - (parseInt(dailySchedule[i]["producedQty"]) + parseInt(dailySchedule[i][day1]) + parseInt(dailySchedule[i][day2]));
             console.log("canAddQty3 :",canAddQty);
             var daviationQty = 0;
             var requestedQty = 0;
             var originalQuantity = 0;
             if(canAddQty < dailySchedule[i][day3] && canAddQty > 0){
               originalQuantity = dailySchedule[i][day3];
               daviationQty = dailySchedule[i][day3] - canAddQty;
               requestedQty = canAddQty;
             }
             else if(canAddQty > dailySchedule[i][day3]){
               requestedQty = dailySchedule[i][day3];
             }
             else{
               daviationQty = dailySchedule[i][day3];
               originalQuantity = dailySchedule[i][day3];
             }
              //console.log("requestedQty",requestedQty);
             //console.log("daviationQty",daviationQty);
             if(requestedQty != 0 && requestedQty != undefined){
               if(newPartNumberId[0]!=null && newPartNumberId[0]!=undefined){
                 await ProductionSchedulePartRelation.create({
                   scheduleId: newproductionScheduleId["id"],
                   partNumberId: newPartNumberId[0]["id"],
                   requestedQuantity: requestedQty,
                   estimatedCompletionDate: 0,
                   isJobCardCreated: false,
                   partRemark: dailySchedule[i].remarks,
                   scheduleStatus:"New",
                   inductionDate:dailySchedule[i]["inductionDate3"],
                   planFor:dailySchedule[i]["planFor3"]
                 })
                 .then()
                 .catch(error => console.log(error));
               }
             }
             if(daviationQty != 0 && daviationQty != undefined){
               if(newPartNumberId[0]!=null && newPartNumberId[0]!=undefined){
                 var singleDeviationPart = {
                   "Production Schedule":newproductionScheduleId["productionScheduleId"],
                   "Part Number": newPartNumberId[0]["partNumber"],
                   "Requested Quantity": originalQuantity,
                   "Produced Quantity": dailySchedule[i]["producedQty"],
                   "Deviation Quantity": daviationQty,
                   "Monthly Quantity": dailySchedule[i]["monthlyQty"],
                   "Induction Date":dailySchedule[i]["inductionDate1"],
                   "Plan For":dailySchedule[i]["planFor1"]
                 }
                 deviationPartList.push(singleDeviationPart);
                 await Deviation.create({
                   scheduleId: newproductionScheduleId["id"],
                   partNumberId: newPartNumberId[0]["id"],
                   originalQuantity: originalQuantity,
                   deviationQuantity: daviationQty,
                   inductionDate:dailySchedule[i]["inductionDate3"],
                   planFor:dailySchedule[i]["planFor3"]
                 })
                 .then()
                 .catch(error => console.log(error));
               }
             }
           }
         }
       }
       else if(counter == 3){
         day = day4;
         var checkProductionSchedule = "Machine Shop Daily Plan " +day;
         var getProductionScheduleId = await ProductionSchedule.find({
           where: { productionScheduleId: { contains: checkProductionSchedule } },
           sort: [{ id: 'DESC'}]
         });
         var postProductionScheduleId
         if(getProductionScheduleId[0]!=null&&getProductionScheduleId[0]!=undefined){
           var latestProductionScheduleId = getProductionScheduleId[0]["productionScheduleId"];
           latestProductionScheduleId = latestProductionScheduleId.substr(35,3);
           latestProductionScheduleId = parseInt(latestProductionScheduleId, 10) +1;
           if(latestProductionScheduleId.toString().length == 1){
             latestProductionScheduleId = "00" + latestProductionScheduleId;
           }
           else if(latestProductionScheduleId.toString().length == 2){
             latestProductionScheduleId = "0" + latestProductionScheduleId;
           }
           postProductionScheduleId = "Machine Shop Daily Plan " +day+"-"+latestProductionScheduleId;
           console.log(latestProductionScheduleId);
         }
         else{
           postProductionScheduleId = "Machine Shop Daily Plan " +day+"-001"
         }
         var currentMonth = day;
         var currentYear = day;
         currentMonth = currentMonth.substr(3,2);
         currentYear = currentYear.substr(6,4);
         console.log(currentYear,currentMonth);
         var getMonthlyScheduleId = await MonthlySchedule.find({
           year:currentYear,
           month:currentMonth
         });
         console.log(getMonthlyScheduleId);
         if(getMonthlyScheduleId[0]!=null&&getMonthlyScheduleId[0]!=undefined){
           var newproductionScheduleId = await ProductionSchedule.create({
             productionScheduleId: postProductionScheduleId,
             estimatedCompletionDate: req.body.estimatedCompletionDate,
             actualCompletionDate: req.body.actualCompletionDate,
             status: 1,
             scheduleType: "Scheduled",
             remarks: "",
             scheduleStatus: "New",
             scheduleDate:day1,
             monthlyScheduleId:getMonthlyScheduleId[0]["id"]
           })
           .fetch()
           .catch(error => console.log(error));
           for(var i=0;i<dailySchedule.length;i++){
             var newPartNumberId = await PartNumber.find({
               partNumber:dailySchedule[i]["partnumber"],
               jcCreateStatus:1
             });
             dayQty = parseInt(dailySchedule[i]["producedQty"]) + parseInt(dailySchedule[i][day1]) + parseInt(dailySchedule[i][day2]) + parseInt(dailySchedule[i][day3]);

             var canAddQty = parseInt(dailySchedule[i]["monthlyQty"]) - dayQty ;
             console.log("canAddQty4 :",canAddQty);
             var daviationQty = 0;
             var requestedQty = 0;
             var originalQuantity = 0;
             if(canAddQty < dailySchedule[i][day4] && canAddQty > 0){
               originalQuantity = dailySchedule[i][day4];
               daviationQty = dailySchedule[i][day4] - canAddQty;
               requestedQty = canAddQty;
             }
             else if(canAddQty > dailySchedule[i][day4]){
               requestedQty = dailySchedule[i][day4];
             }
             else{
               daviationQty = dailySchedule[i][day4];
               originalQuantity = dailySchedule[i][day4];
             }
             console.log("requestedQty",requestedQty);
             console.log("part",newPartNumberId);
             if(requestedQty != 0 && requestedQty != undefined){
               if(newPartNumberId[0]!=null && newPartNumberId[0]!=undefined){
                 await ProductionSchedulePartRelation.create({
                   scheduleId: newproductionScheduleId["id"],
                   partNumberId: newPartNumberId[0]["id"],
                   requestedQuantity: requestedQty,
                   estimatedCompletionDate: 0,
                   isJobCardCreated: false,
                   partRemark: dailySchedule[i].remarks,
                   scheduleStatus:"New",
                   inductionDate:dailySchedule[i]["inductionDate4"],
                   planFor:dailySchedule[i]["planFor4"]
                 })
                 .then()
                 .catch(error => console.log(error));
               }
             }
             if(daviationQty != 0 && daviationQty != undefined){
               if(newPartNumberId[0]!=null && newPartNumberId[0]!=undefined){
                 var singleDeviationPart = {
                   "Production Schedule":newproductionScheduleId["productionScheduleId"],
                   "Part Number": newPartNumberId[0]["partNumber"],
                   "Requested Quantity": originalQuantity,
                   "Produced Quantity": dailySchedule[i]["producedQty"],
                   "Deviation Quantity": daviationQty,
                   "Monthly Quantity": dailySchedule[i]["monthlyQty"],
                   "Induction Date":dailySchedule[i]["inductionDate1"],
                   "Plan For":dailySchedule[i]["planFor1"]
                 }
                 deviationPartList.push(singleDeviationPart);
                 await Deviation.create({
                   scheduleId: newproductionScheduleId["id"],
                   partNumberId: newPartNumberId[0]["id"],
                   originalQuantity: originalQuantity,
                   deviationQuantity: daviationQty,
                   inductionDate:dailySchedule[i]["inductionDate4"],
                   planFor:dailySchedule[i]["planFor4"]
                 })
                 .then()
                 .catch(error => console.log(error));
               }
             }
           }
         }
       }
       else if(counter == 4){
         day = day5;
         var checkProductionSchedule = "Machine Shop Daily Plan " +day;
         var getProductionScheduleId = await ProductionSchedule.find({
           where: { productionScheduleId: { contains: checkProductionSchedule } },
           sort: [{ id: 'DESC'}]
         });
         var postProductionScheduleId
         if(getProductionScheduleId[0]!=null&&getProductionScheduleId[0]!=undefined){
           var latestProductionScheduleId = getProductionScheduleId[0]["productionScheduleId"];
           latestProductionScheduleId = latestProductionScheduleId.substr(35,3);
           latestProductionScheduleId = parseInt(latestProductionScheduleId, 10) +1;
           if(latestProductionScheduleId.toString().length == 1){
             latestProductionScheduleId = "00" + latestProductionScheduleId;
           }
           else if(latestProductionScheduleId.toString().length == 2){
             latestProductionScheduleId = "0" + latestProductionScheduleId;
           }
           postProductionScheduleId = "Machine Shop Daily Plan " +day+"-"+latestProductionScheduleId;
           console.log(latestProductionScheduleId);
         }
         else{
           postProductionScheduleId = "Machine Shop Daily Plan " +day+"-001"
         }
         var currentMonth = day;
         var currentYear = day;
         currentMonth = currentMonth.substr(3,2);
         currentYear = currentYear.substr(6,4);
         console.log(currentYear,currentMonth);
         var getMonthlyScheduleId = await MonthlySchedule.find({
           year:currentYear,
           month:currentMonth
         });
         console.log(getMonthlyScheduleId);
         if(getMonthlyScheduleId[0]!=null&&getMonthlyScheduleId[0]!=undefined){
           var newproductionScheduleId = await ProductionSchedule.create({
             productionScheduleId: postProductionScheduleId,
             estimatedCompletionDate: req.body.estimatedCompletionDate,
             actualCompletionDate: req.body.actualCompletionDate,
             status: 1,
             scheduleType: "Scheduled",
             remarks: "",
             scheduleStatus: "New",
             scheduleDate:day1,
             monthlyScheduleId:getMonthlyScheduleId[0]["id"]
           })
           .fetch()
           .catch(error => console.log(error));
           for(var i=0;i<dailySchedule.length;i++){
             var newPartNumberId = await PartNumber.find({
               partNumber:dailySchedule[i]["partnumber"],
               jcCreateStatus:1
             });
             var canAddQty = parseInt(dailySchedule[i]["monthlyQty"]) - (parseInt(dailySchedule[i]["producedQty"]) + parseInt(dailySchedule[i][day1]) + parseInt(dailySchedule[i][day2]) + parseInt(dailySchedule[i][day3]) + parseInt(dailySchedule[i][day4]));
             console.log("canAddQty5 :",canAddQty);
             var daviationQty = 0;
             var requestedQty = 0;
             var originalQuantity = 0;
             if(canAddQty < dailySchedule[i][day5] && canAddQty > 0){
               originalQuantity = dailySchedule[i][day5];
               daviationQty = dailySchedule[i][day5] - canAddQty;
               requestedQty = canAddQty;
             }
             else if(canAddQty > dailySchedule[i][day5]){
               requestedQty = dailySchedule[i][day5];
             }
             else{
               daviationQty = dailySchedule[i][day5];
               originalQuantity = dailySchedule[i][day5];
             }
              //console.log("requestedQty",requestedQty);
             //console.log("daviationQty",daviationQty);
             if(requestedQty != 0 && requestedQty != undefined){
               if(newPartNumberId[0]!=null && newPartNumberId[0]!=undefined){
                 await ProductionSchedulePartRelation.create({
                   scheduleId: newproductionScheduleId["id"],
                   partNumberId: newPartNumberId[0]["id"],
                   requestedQuantity: requestedQty,
                   estimatedCompletionDate: 0,
                   isJobCardCreated: false,
                   partRemark: dailySchedule[i].remarks,
                   scheduleStatus:"New",
                   inductionDate:dailySchedule[i]["inductionDate5"],
                   planFor:dailySchedule[i]["planFor5"]
                 })
                 .then()
                 .catch(error => console.log(error));
               }
             }
             if(daviationQty != 0 && daviationQty != undefined){
               if(newPartNumberId[0]!=null && newPartNumberId[0]!=undefined){
                 var singleDeviationPart = {
                   "Production Schedule":newproductionScheduleId["productionScheduleId"],
                   "Part Number": newPartNumberId[0]["partNumber"],
                   "Requested Quantity": originalQuantity,
                   "Produced Quantity": dailySchedule[i]["producedQty"],
                   "Deviation Quantity": daviationQty,
                   "Monthly Quantity": dailySchedule[i]["monthlyQty"],
                   "Induction Date":dailySchedule[i]["inductionDate1"],
                   "Plan For":dailySchedule[i]["planFor1"]
                 }
                 deviationPartList.push(singleDeviationPart);
                 await Deviation.create({
                   scheduleId: newproductionScheduleId["id"],
                   partNumberId: newPartNumberId[0]["id"],
                   originalQuantity: originalQuantity,
                   deviationQuantity: daviationQty,
                   inductionDate:dailySchedule[i]["inductionDate5"],
                   planFor:dailySchedule[i]["planFor5"]
                 })
                 .then()
                 .catch(error => console.log(error));
               }
             }
           }
         }
       }
       res.send();
     }
     else{
       console.log("Line 406",req.body.productionScheduleId);
       var getProductionScheduleId = await ProductionSchedule.find({id:req.body.productionScheduleId});
       if(getProductionScheduleId[0]!=null&&getProductionScheduleId[0]!=undefined){
         console.log("Line 408", getProductionScheduleId);
         if(getProductionScheduleId[0]["scheduleStatus"]=="New"){
           await ProductionSchedulePartRelation.destroy({scheduleId:req.body.productionScheduleId});
           var obj=Object.getOwnPropertyNames(dailySchedule[0]);
           var day1=obj[2];
           var day2=obj[3];
           var day3=obj[4];
           var day4=obj[5];
           var day5=obj[6];
           var day;
           var productionScheduleDate = getProductionScheduleId[0]["productionScheduleId"];
           productionScheduleDate = productionScheduleDate.substr(24,10)
           console.log("Line 420", productionScheduleDate);
           if(productionScheduleDate == day1){
             day = day1
           }
           else if(productionScheduleDate == day2){
             day = day2
           }
           else if(productionScheduleDate == day3){
             day = day3
           }
           else if(productionScheduleDate == day4){
             day = day4
           }
           else if(productionScheduleDate == day5){
             day = day5
           }
           console.log("Line 437",dailySchedule.length);
           for(var i=0;i<dailySchedule.length;i++){
             console.log("Line 439", dailySchedule[i]["Part Number"]);
             var newPartNumberId = await PartNumber.find({
               partNumber:dailySchedule[i]["Part Number"],
               jcCreateStatus:1
             });
             console.log("Line 440", newPartNumberId);
             console.log("Line 442", dailySchedule[i]);
             
             var quantity = dailySchedule[i][day];
             var remarks = dailySchedule[i]["Remarks for first date in column"];
             if(newPartNumberId[0] != null && newPartNumberId[0]!= undefined){
               console.log("Line 448",newPartNumberId);
               for(var j=0;j<newPartNumberId.length;j++){
                 await ProductionSchedulePartRelation.create({
                   scheduleId: req.body.productionScheduleId,
                   partNumberId: newPartNumberId[j]["id"],
                   requestedQuantity: quantity,
                   estimatedCompletionDate: 0,
                   isJobCardCreated: false,
                   partRemark: remarks,
                   scheduleStatus:"New",
                   inductionDate:dailySchedule[i]["inductionDate1"],
                   planFor:dailySchedule[i]["planFor1"]
                 })
                 .then()
                 .catch(error => console.log(error));
               }
             }
              // break;
            }
            res.send();
          }
          else{
            res.send("Already Started");
          }
        }
        else{
          res.send("Not Found");
        }
      }
      
      var obj=Object.getOwnPropertyNames(dailySchedule[0]);
      var day1=obj[2];
      console.log(day1);
      var currentMonth = day1;
      var currentYear = day1;
      currentMonth = currentMonth.substr(3,2);
      currentYear = currentYear.substr(6,4);
      var cycleTimeList = [];
      var finalResult = [];
      var machineGroup ={};
      var partList = [];
      console.log("currentYear & month",currentYear,currentMonth);
      sails.log.info("currentYear & month",currentYear,currentMonth);
      var getMonthlyScheduleId = await MonthlySchedule.find({
        year:currentYear,
        month:currentMonth
      });
      var productionScheduleId = await ProductionSchedule.find({
        where: {remarks:{ '!=' :''},monthlyScheduleId:getMonthlyScheduleId[0]["id"]}
        ,sort:[{ id: 'DESC'}]
      });
      console.log(productionScheduleId[0]["productionScheduleId"]);
      var date = productionScheduleId[0]["productionScheduleId"].substring(24,34);
      console.log("Date :", date);
      var productionScheduleIds = await ProductionSchedule.find({
        where: {productionScheduleId:{
          'contains':date
        }}
        ,sort:[{ id: 'DESC'}]
      });
      console.log("productionScheduleIds length",productionScheduleIds.length);
      for (var s=0;s<productionScheduleIds.length;s++){
        if(productionScheduleIds[s]!=null || productionScheduleIds[s]!=undefined){
          var productionSchedulePartRelationList = await ProductionSchedulePartRelation.find({
            scheduleId:productionScheduleIds[s]["id"]
          });
        }
        console.log("ProductionSchedulePartRelationList",productionSchedulePartRelationList.length);
        for(var a=0;a<productionSchedulePartRelationList.length;a++){
          var cycletime="";
          var machineGroup="";
          var processSequenceList = await ProcessSequence.find({
            partId:productionSchedulePartRelationList[a]["partNumberId"],
            status:1
          }).populate('machineGroupId')
          .populate('partId');
          if(processSequenceList[0] != null && processSequenceList[0] !=undefined){
            if(productionSchedulePartRelationList[a]["requestedQuantity"]!=0){
              for(var b=0;b<processSequenceList.length;b++){
                cycletime = processSequenceList[b]["cycleTime"] * productionSchedulePartRelationList[a]["requestedQuantity"];
                machineGroup = processSequenceList[b]["machineGroupId"]["name"];

                var sequenceData = {
                  CycleTime:cycletime,
                  MachineGroup:machineGroup
                }
                cycleTimeList.push(sequenceData);
              }

              var partCycleTime = {
                'PartNumber': processSequenceList[0]["partId"]["partNumber"],
                'Part Description': processSequenceList[0]["partId"]["description"],
                'Load Time (In minutes)' :Math.round(cycletime/60)
              }
              partList.push(partCycleTime);
            }
          }
        }
      }
      console.log("cycleTimeList",cycleTimeList);
      var s=0;
      const machineGroupsList = [...new Set(cycleTimeList.map(cycleTimeList => cycleTimeList.MachineGroup))];
      console.log("machineGroupsList",machineGroupsList);

      for(var i=0;i<machineGroupsList.length;i++){
        for(var c=0;c<cycleTimeList.length;c++){
          if(cycleTimeList[c]["MachineGroup"] == machineGroupsList[i]){
            s = s + cycleTimeList[c]["CycleTime"];
          }
        }
        machineGroup = {
          machineGroup : machineGroupsList[i],
          load : Math.round(s/60)
        }
        finalResult.push(machineGroup);
        s=0;
      }
      console.log("finalResult",finalResult,finalResult.length);
      var newEmployeeList = await Employee.find({
        notifyForMachineMaintenance:1
      });
      var dups = [];
      var arr = partList.filter(function(el) {
      // If it is not a duplicate, return true
      if (dups.indexOf(el.PartNumber) == -1) {
        dups.push(el.PartNumber);
        return true;
      }
      return false;

    }); 
      console.log("dups",arr);
      var xls1 = json2xls(arr);
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
      var curr_time = d.getTime();
      dateTimeFormat = curr_date + "-" + curr_month + "-" + curr_year+ "-" + curr_time;
      var filename1 = 'D:/TMML/BRiOT-TMML-Machine-Shop-Solution/server/Reports/ProductionSchedule/Daily-ProductionSchedule-Report '+ dateTimeFormat +'.xlsx';
      // var filename1 = 'E:/TMML-29-05/Server/Reports/ProductionSchedule/Daily-ProductionSchedule-Report '+ dateTimeFormat +'.xlsx';
      fs.writeFileSync(filename1, xls1, 'binary',function(err) {
        if (err) {
          console.log('Some error occured - file either not saved or corrupted file saved.');
          sails.log.error("Some error occured - file either not saved or corrupted file saved.");
        } else {
          console.log('It\'s saved!');
        }
      });

      if(newEmployeeList[0]!=null&&newEmployeeList[0]!=undefined){
        mailText = mailText + "\n  MachineGroup wise load for a Date: "+ day1 +" is as below :- ";
        for(var i=0;i<finalResult.length;i++){
          mailText = mailText + "\n" + "MachineGroup :"+ finalResult[i]["machineGroup"] +", & Load :"+finalResult[i]["load"]+ " minutes \n" ;
        }

        mailText = mailText + "\n" +"Part Numbers not added in daily schedule due to not found in monthly schedule";
        for(var a=0;a<notInMonthlySchedulePartList.length;a++){
          mailText = mailText + "\n" +notInMonthlySchedulePartList[a]["Part Number"];
        }

        mailText = mailText + "\n" + "For deviation list please Please find attached file named Deviation Report";
        var xls2 = json2xls(deviationPartList);
        var filename2 = 'D:/TMML/BRiOT-TMML-Machine-Shop-Solution/server/Reports/ProductionSchedule/Deviation Report '+ dateTimeFormat +'.xlsx';
        // var filename2 = 'E:/TMML-29-05/Server/Reports/ProductionSchedule/Deviation Report '+ dateTimeFormat +'.xlsx';
        fs.writeFileSync(filename2, xls2, 'binary',function(err) {
          if (err) {
            console.log('Some error occured - file either not saved or corrupted file saved.');
            sails.log.error("Some error occured - file either not saved or corrupted file saved.");
          } else {
            console.log('It\'s saved!');
          }
        });
        console.log(mailText);
        console.log(deviationPartList);

        for(var i=0;i<newEmployeeList.length;i++){
          {
            var mailOptions = {
              from: "MachineShop_WIP@tatamarcopolo.com", // sender address (who sends)
              to: newEmployeeList[i].email, // list of receivers (who receives)
              // to:"santosh.adaki@tatamarcopolo.com",
              subject: "Daily Schedule Upload Status", // Subject line
              text: mailText,
              attachments :[
              {
                'filename':'Daily-ProductionSchedule-Report '+dateTimeFormat+'.xlsx',
                'path': filename1
              },
              {
                'filename':'Deviation Report  '+dateTimeFormat+'.xlsx',
                'path': filename2
              }
              ],
            };
            transporter.sendMail(mailOptions, function(error, info) {
              if(error){
                sails.log.error("Error while Sending monthly schedule mail",error);
                // sails.log.error(error);
              } else {
                sails.log.info('Message sent: ' + info.response);
              }
            });
          }
        }
      }
    },
    
    dailyMonthlyReport: async function(req,res){

      var monthlySchedule = await MonthlySchedule.find({
        year:req.query.year,
        month:req.query.month
      });
      
      console.log('monthlySchedule: ', monthlySchedule);
      var month = req.query.month;
      var year = req.query.year;
      console.log(month,year);
      var resTable = [];
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
      var sql = ` WITH mytable as ( select distinct partNumber,requiredInMonth,monthlyScheduleId from monthlyschedulepartrelation where monthlyScheduleId =  `+monthlySchedule[0]["id"]+`)
      SELECT distinct partNumberId,SUM([requestedQuantity]) as sumValue,
      (select top 1 mytable.partNumber from mytable with (nolock) where ( mytable.monthlyScheduleId= `+monthlySchedule[0]["id"]+` AND [TestDatabase].[dbo].[productionschedulepartrelation].partNumberId= mytable.partNumber  ) )
      as partNumber,(select top 1  mytable.requiredInMonth from mytable with (nolock) where ( [TestDatabase].[dbo].[productionschedulepartrelation].partNumberId = mytable.partNumber))
      as requiredInMonth,(select top 1  partNumber from [TestDatabase].[dbo].partnumber with (nolock) where ( [TestDatabase].[dbo].[productionschedulepartrelation].partNumberId =[TestDatabase].[dbo].partnumber.id))
      as PartNumber
      FROM [TestDatabase].[dbo].[productionschedulepartrelation] left outer join mytable as parts on parts.partNumber = [TestDatabase].[dbo].[productionschedulepartrelation].partNumberId where [TestDatabase].[dbo].[productionschedulepartrelation].updatedAt Between `+createdAtStart+` AND `+createdAtEnd+`  And isJobCardCreated=1 group by [TestDatabase].[dbo].[productionschedulepartrelation].partNumberId  order by sumValue desc
      `;
      console.log("sql",sql);
      var monthlyData = await sails.sendNativeQuery(sql,[]);
      console.log(monthlyData);
      var resTable = [];
      if(monthlyData["recordset"] != null && monthlyData["recordset"] != undefined){
        for(var i=0; i < monthlyData["recordset"].length; i++){
          if(monthlyData["recordset"][i]["partNumber"] != null && monthlyData["recordset"][i]["partNumber"] != undefined){
            if(monthlyData["recordset"][i]["requiredInMonth"] == null || monthlyData["recordset"][i]["requiredInMonth"] =='NULL'){
              monthlyData["recordset"][i]["requiredInMonth"] = 0;
            }
            var pushPartDetails = {
              partNumberId: monthlyData["recordset"][i]["partNumberId"],
              monthlyQuantity: monthlyData["recordset"][i]["requiredInMonth"],
              quantitiesInProduction: monthlyData["recordset"][i]["sumValue"],
              partNumber:monthlyData["recordset"][i]["PartNumber"],
            }
            resTable.push(pushPartDetails);
          }
        }
      }
      var notYetCreated = `select distinct partNumber,requiredInMonth,monthlyScheduleId ,
      (select partNumber from TestDatabase.dbo.partnumber where id=TestDatabase.dbo.monthlyschedulepartrelation.partNumber) as PartNumber from monthlyschedulepartrelation where monthlyScheduleId = `+monthlySchedule[0]["id"]+` and partNumber
      NOT IN(select partnumberId from productionschedulepartrelation where createdAt Between `+createdAtStart+` AND `+createdAtEnd+` and monthlyschedulepartrelation.partNumber = productionschedulepartrelation.partNumberId and isJobCardCreated=1)`;
      var monthlyData1 = await sails.sendNativeQuery(notYetCreated,[]);
      if(monthlyData1["recordset"] != null && monthlyData1["recordset"] != undefined){
        for(var i=0; i < monthlyData1["recordset"].length; i++){
          var pushPartDetails = {
            partNumberId: monthlyData1["recordset"][i]["partNumber"],
            monthlyQuantity: monthlyData1["recordset"][i]["requiredInMonth"],
            quantitiesInProduction: 0,
            partNumber:monthlyData1["recordset"][i]["PartNumber"]
          }
          resTable.push(pushPartDetails);
        }
      }
      res.send(resTable);
    }
  };
