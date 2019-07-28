/**
 * ProductionScheduleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

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
    .catch(error => console.log(error));
    console.log(newproductionScheduleId["id"]);
    for (var i = 0; i < req.body.partMaster.length; i++) {
      console.log(req.body.partMaster[i].partNumberId);
      var newPartNumber = await PartNumber.findOne({ partNumber: req.body.partMaster[i].partNumberId });
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
    // console.log(req.body.dailySchedule[0].getOwnPropertyNames);
    if(req.body.actions=="New"){
      var obj=Object.getOwnPropertyNames(req.body.dailySchedule[0]);
      var day1=obj[2];
      var day2=obj[3];
      var day3=obj[4];
      var day4=obj[5];
      var day5=obj[6];
      console.log(day1);
      console.log(req.body.dailySchedule[0][day1]);
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
            remarks: "",
            scheduleStatus: "New",
            scheduleDate:day1,
            monthlyScheduleId:getMonthlyScheduleId[0]["id"]
          })
          .fetch()
          .catch(error => console.log(error));
          for(var i=0;i<req.body.dailySchedule.length;i++){
            console.log(req.body.dailySchedule[i]["partnumber"]);
            var newPartNumberId = await PartNumber.find({
              partNumber:req.body.dailySchedule[i]["partnumber"]
            });
            console.log(newPartNumberId);
            if(newPartNumberId!=null && newPartNumberId!=undefined){
              await ProductionSchedulePartRelation.create({
                scheduleId: newproductionScheduleId["id"],
                partNumberId: newPartNumberId[i]["id"],
                requestedQuantity: req.body.dailySchedule[i][day1],
                estimatedCompletionDate: 0,
                isJobCardCreated: false,
                partRemark: req.body.dailySchedule[i].remarks,
                scheduleStatus:"New"
              })
              .then()
              .catch(error => console.log(error));
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
          for(var i=0;i<req.body.dailySchedule.length;i++){
            var newPartNumberId = await PartNumber.find({
              partNumber:req.body.dailySchedule[i]["partnumber"]
            });
            if(newPartNumberId!=null && newPartNumberId!=undefined){
              await ProductionSchedulePartRelation.create({
                scheduleId: newproductionScheduleId["id"],
                partNumberId: newPartNumberId[i]["id"],
                requestedQuantity: req.body.dailySchedule[i][day2],
                estimatedCompletionDate: 0,
                isJobCardCreated: false,
                partRemark: "",
                scheduleStatus: "New"
              })
              .then()
              .catch(error => console.log(error));
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
          for(var i=0;i<req.body.dailySchedule.length;i++){
            var newPartNumberId = await PartNumber.find({
              partNumber:req.body.dailySchedule[i]["partnumber"]
            });
            if(newPartNumberId!=null && newPartNumberId!=undefined){
              await ProductionSchedulePartRelation.create({
                scheduleId: newproductionScheduleId["id"],
                partNumberId: newPartNumberId[i]["id"],
                requestedQuantity: req.body.dailySchedule[i][day3],
                estimatedCompletionDate: 0,
                isJobCardCreated: false,
                partRemark: "",
                scheduleStatus: "New"
              })
              .then()
              .catch(error => console.log(error));
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
          for(var i=0;i<req.body.dailySchedule.length;i++){
            var newPartNumberId = await PartNumber.find({
              partNumber:req.body.dailySchedule[i]["partnumber"]
            });
            if(newPartNumberId!=null && newPartNumberId!=undefined){
              await ProductionSchedulePartRelation.create({
                scheduleId: newproductionScheduleId["id"],
                partNumberId: newPartNumberId[i]["id"],
                requestedQuantity: req.body.dailySchedule[i][day4],
                estimatedCompletionDate: 0,
                isJobCardCreated: false,
                partRemark: "",
                scheduleStatus: "New"
              })
              .then()
              .catch(error => console.log(error));
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
          for(var i=0;i<req.body.dailySchedule.length;i++){
            var newPartNumberId = await PartNumber.find({
              partNumber:req.body.dailySchedule[i]["partnumber"]
            });
            if(newPartNumberId!=null && newPartNumberId!=undefined){
              await ProductionSchedulePartRelation.create({
                scheduleId: newproductionScheduleId["id"],
                partNumberId: newPartNumberId[i]["id"],
                requestedQuantity: req.body.dailySchedule[i][day5],
                estimatedCompletionDate: 0,
                isJobCardCreated: false,
                partRemark: "",
                scheduleStatus: "New"
              })
              .then()
              .catch(error => console.log(error));
            }
          }
        }
      }
      res.send();
    }
    else{
      var getProductionScheduleId = await ProductionSchedule.find({id:req.body.productionScheduleId});
      if(getProductionScheduleId[0]!=null&&getProductionScheduleId[0]!=undefined){
        console.log(getProductionScheduleId);
        if(getProductionScheduleId[0]["scheduleStatus"]=="New"){
          await ProductionSchedulePartRelation.destroy({scheduleId:req.body.productionScheduleId});
          var obj=Object.getOwnPropertyNames(req.body.dailySchedule[0]);
          var day1=obj[2];
          var day2=obj[3];
          var day3=obj[4];
          var day4=obj[5];
          var day5=obj[6];
          var day;
          var productionScheduleDate = getProductionScheduleId[0]["productionScheduleId"];
          productionScheduleDate = productionScheduleDate.substr(24,10)
          console.log(productionScheduleDate);
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
          for(var i=0;i<req.body.dailySchedule.length;i++){
            var newPartNumberId = await PartNumber.find({
              partNumber:req.body.dailySchedule[i].partnumber
            });
            if(newPartNumberId!=null && newPartNumberId!=undefined){
              await ProductionSchedulePartRelation.create({
                scheduleId: req.body.productionScheduleId,
                partNumberId: newPartNumberId[0]["id"],
                requestedQuantity: req.body.dailySchedule[i][day],
                estimatedCompletionDate: 0,
                isJobCardCreated: false,
                partRemark: req.body.dailySchedule[i].remarks,
                scheduleStatus:"New"
              })
              .then()
              .catch(error => console.log(error));
            }
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

  },

  dailyMonthlyReport: async function(req,res){

    var monthlySchedule = await MonthlySchedule.find({
      year:req.body.year,
      month:req.body.month
    });

    console.log('monthlySchedule: ', monthlySchedule);

    if(monthlySchedule != undefined && monthlySchedule.length > 0 && monthlySchedule[0] !=null){
      console.log('monthlySchedulePartNumbers: ', monthlySchedule[0]["id"]);
      var monthlySchedulePartNumbers = await MonthlySchedulePartRelation.find({
        monthlyScheduleId:monthlySchedule[0]["id"]
      }).populate('partNumber');
    }

    console.log("MonthlySchedulePartRelation: ", monthlySchedulePartNumbers);

    // console.log(monthlySchedulePartNumbers.length);
    if(monthlySchedulePartNumbers.length > 0 && monthlySchedulePartNumbers[0] != null && monthlySchedulePartNumbers[0] != undefined){
      console.log('monthly schedule id: ', monthlySchedule[0]["id"]);
      var dailySchedule = await ProductionSchedule.find({
        monthlyScheduleId:monthlySchedule[0]["id"]
      });
    }
    // console.log(dailySchedule.length);
    var resTable = [];
    if(monthlySchedulePartNumbers != null && monthlySchedulePartNumbers != undefined){
      for(var i=0; i < monthlySchedulePartNumbers.length; i++){
        var partNumberQuantity = 0;
        if(dailySchedule!=null&&dailySchedule!=undefined){
          for(var j=0;j<dailySchedule.length;j++){
            // console.log(dailySchedule[j]["id"]);
            // console.log(monthlySchedulePartNumbers[i]["partNumber"]);
            var dailySchedulePartNumbers = await ProductionSchedulePartRelation.find({
              scheduleId:dailySchedule[j]["id"],
              partNumberId:monthlySchedulePartNumbers[i]["partNumber"]['id']
            });
            // console.log(dailySchedulePartNumbers);
            if(dailySchedulePartNumbers[0]!=null && dailySchedulePartNumbers!=undefined){
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
  }
};
