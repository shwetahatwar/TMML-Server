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
    var obj=Object.getOwnPropertyNames(req.body.dailySchedule[0]);
    var day1=obj[2];
    var day2=obj[3];
    var day3=obj[4];
    var day4=obj[5];
    var day5=obj[6];
    console.log(day1);
    console.log(req.body.dailySchedule[0][day1]);
    // var counter=0;
    var day;
    for(var counter=0;counter<5;counter++)
    if(counter==0){
      day = day1;
      var newproductionScheduleId = await ProductionSchedule.create({
        productionScheduleId: "Machine Shop Daily Plan " +day+"-001",
        estimatedCompletionDate: req.body.estimatedCompletionDate,
        actualCompletionDate: req.body.actualCompletionDate,
        status: 0,
        scheduleType: "Scheduled",
        remarks: "",
        scheduleStatus: "New",
        scheduleDate:day1
      })
      .fetch()
      .catch(error => console.log(error));
      for(var i=0;i<req.body.dailySchedule.length;i++){
        await ProductionSchedulePartRelation.create({
          scheduleId: newproductionScheduleId["id"],
          partNumberId: req.body.dailySchedule[i].partnumber,
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
    else if(counter == 1){
      day = day2;
      var newproductionScheduleId = await ProductionSchedule.create({
        productionScheduleId: "Machine Shop Daily Plan " +day+"-001",
        estimatedCompletionDate: req.body.estimatedCompletionDate,
        actualCompletionDate: req.body.actualCompletionDate,
        status: 0,
        scheduleType: "Scheduled",
        remarks: "",
        scheduleStatus: "New",
        scheduleDate:day2
      })
      .fetch()
      .catch(error => console.log(error));
      for(var i=0;i<req.body.dailySchedule.length;i++){
        await ProductionSchedulePartRelation.create({
          scheduleId: newproductionScheduleId["id"],
          partNumberId: req.body.dailySchedule[i].partnumber,
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
    else if(counter == 2){
      day = day3;
      var newproductionScheduleId = await ProductionSchedule.create({
        productionScheduleId: "Machine Shop Daily Plan " +day+"-001",
        estimatedCompletionDate: req.body.estimatedCompletionDate,
        actualCompletionDate: req.body.actualCompletionDate,
        status: 0,
        scheduleType: "Scheduled",
        remarks: "",
        scheduleStatus: "New",
        scheduleDate:day3
      })
      .fetch()
      .catch(error => console.log(error));
      for(var i=0;i<req.body.dailySchedule.length;i++){
        await ProductionSchedulePartRelation.create({
          scheduleId: newproductionScheduleId["id"],
          partNumberId: req.body.dailySchedule[i].partnumber,
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
    else if(counter == 3){
      day = day4;
      var newproductionScheduleId = await ProductionSchedule.create({
        productionScheduleId: "Machine Shop Daily Plan " +day+"-001",
        estimatedCompletionDate: req.body.estimatedCompletionDate,
        actualCompletionDate: req.body.actualCompletionDate,
        status: 0,
        scheduleType: "Scheduled",
        remarks: "",
        scheduleStatus: "New",
        scheduleDate:day4
      })
      .fetch()
      .catch(error => console.log(error));
      for(var i=0;i<req.body.dailySchedule.length;i++){
        await ProductionSchedulePartRelation.create({
          scheduleId: newproductionScheduleId["id"],
          partNumberId: req.body.dailySchedule[i].partnumber,
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
    else if(counter == 4){
      day = day5;
      var newproductionScheduleId = await ProductionSchedule.create({
        productionScheduleId: "Machine Shop Daily Plan " +day+"-001",
        estimatedCompletionDate: req.body.estimatedCompletionDate,
        actualCompletionDate: req.body.actualCompletionDate,
        status: 0,
        scheduleType: "Scheduled",
        remarks: "",
        scheduleStatus: "New",
        scheduleDate:day5
      })
      .fetch()
      .catch(error => console.log(error));
      for(var i=0;i<req.body.dailySchedule.length;i++){
        await ProductionSchedulePartRelation.create({
          scheduleId: newproductionScheduleId["id"],
          partNumberId: req.body.dailySchedule[i].partnumber,
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
    res.send();
    // for(var i=0;i<req.body.dailySchedule.length;i++){


    //   counter++;
    //   await ProductionSchedulePartRelation.create({
    //     scheduleId: newproductionScheduleId["id"],
    //     partNumberId: newPartNumber["id"],
    //     requestedQuantity: req.body.partMaster[i].requestedQuantity,
    //     estimatedCompletionDate: req.body.partMaster[i].estimatedCompletionDate,
    //     isJobCardCreated: req.body.partMaster[i].isJobCardCreated,
    //     partRemark: req.body.partMaster[i].partRemark
    //   })
    //   .then()
    //   .catch(error => console.log(error));
    //   // for(var i=0;i<req.body.dailySchedule[i].length;i++){

    //   // }
    // }

    // for(var columnNumber = 0 ;columnNumber<5;columnNumber++){
    //   var newproductionScheduleId = await ProductionSchedule.create({
    //     productionScheduleId: req.body.productionScheduleId,
    //     estimatedCompletionDate: req.body.estimatedCompletionDate,
    //     actualCompletionDate: req.body.actualCompletionDate,
    //     status: req.body.status,
    //     scheduleType: req.body.scheduleType,
    //     remarks: req.body.remarks,
    //     scheduleStatus: req.body.scheduleStatus
    //   })
    //   .fetch()
    //   .catch(error => console.log(error));
    //   if(newproductionScheduleId!= null&& newproductionScheduleId!=undefined){
    //     for(var i;i<req.body.dailySchedule.length;i++){
    //       var newPartNumber = await PartNumber.findOne({ partNumber: req.body.partMaster[i].partNumberId });
    //       await ProductionSchedulePartRelation.create({
    //         scheduleId: newproductionScheduleId["id"],
    //         partNumberId: newPartNumber["id"],
    //         requestedQuantity: req.body.partMaster[i].requestedQuantity,
    //         estimatedCompletionDate: req.body.partMaster[i].estimatedCompletionDate,
    //         isJobCardCreated: req.body.partMaster[i].isJobCardCreated,
    //         partRemark: req.body.partMaster[i].partRemark
    //       })
    //       .then()
    //       .catch(error => console.log(error));
    //     }
    //   }
    // }
  }

  // findByPart:async function (req,res) {
  //   var foundPart = new Array();
  //   var productionSchedule = ProductionSchedulePartRelation.find({id:req.body.productionScheduleId});
  //   if(productionSchedule != null && productionSchedule != undefined){
  //     var processSequenceFoundId = new Array();
  //     for(var i=0;i<productionSchedule.length;i++){
  //       var processSequencePartRelation = ProcessSequence.find({
  //         partId:productionSchedule[i]["partNumberId"],
  //         sequenceNumber:1
  //       });
  //       if(processSequencePartRelation!=null && processSequencePartRelation!= undefined){
  //         processSequenceFoundId.push(processSequencePartRelation["id"]);
  //       }

  //     }
  //   }
  // }
};
