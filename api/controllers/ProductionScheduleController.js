/**
 * ProductionScheduleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function(req,res){
    var newproductionScheduleId = await ProductionSchedule.create({
    productionScheduleId:req.body.productionScheduleId,
    estimatedCompletionDate:req.body.estimatedCompletionDate,
    actualCompletionDate:req.body.actualCompletionDate,
    status:req.body.status
  })
  .fetch()
  .catch(error=>console.log(error));
  console.log(newproductionScheduleId["id"]);
  for(var i=0;i<req.body.partMaster.length;i++){
    ProductionSchedulePartRelation.create({
      scheduleId:newproductionScheduleId["id"],
      partNumberId:req.body.partMaster[i].partNumberId,
      requestedQuantity:req.body.partMaster[i].requestedQuantity,
      estimatedCompletionDate:req.body.partMaster[i].estimatedCompletionDate,
      isJobCardCreated:req.body.partMaster[i].isJobCardCreated
    })
    .then()
    .catch(error=>console.log(error));
  }
  res.status(200).send(newproductionScheduleId);
}
};

