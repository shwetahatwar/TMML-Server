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
    for(var columnNumber = 2 ;columnNumber<7;columnNumber++){
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
      for(var i;i<req.body.dailySchedule.length;i++){
        
      }
    }
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
