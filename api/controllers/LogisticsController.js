/**
 * LogisticsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  update: async function(req,res){
    await Jobprocesssequencerelation.update({
      id:req.body.JobProcessSequenceRelationId
    })
    .set({
      status: req.body.status,
      locationId: req.body.locationId,
      machineId: req.body.machineId
    });
    // await Machine.update({
    //   id:req.body.machineId
    // })
    // .set({
    //   status:req.body.machineStatus
    // });
    await JobCard.update({
      id:req.body.jobCardId
    })
    .set({
      currentLocation:req.body.locationId
    });
    res.send("OK")
  }

};

