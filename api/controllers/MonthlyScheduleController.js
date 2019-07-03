/**
 * MonthlyScheduleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function(req,res){
    for(var i;i<req.body.monthlySchedule.length;i++){
      MonthlySchedule.create({
        year:req.body.monthlySchedule[i].year,
        month:req.body.monthlySchedule[i].month,
        scheduleName:req.body.monthlySchedule[i].scheduleName,
        partNumber:req.body.monthlySchedule[i].partNumber,
        description:req.body.monthlySchedule[i].description,
        UOM:req.body.monthlySchedule[i].UOM,
        proc:req.body.monthlySchedule[i].proc,
        EP:req.body.monthlySchedule[i].EP,
        issueLoc:req.body.monthlySchedule[i].issueLoc,
        requiredInMonth:req.body.monthlySchedule[i].requiredInMonth,
        CAT:req.body.monthlySchedule[i].CAT
      })
      .catch(error=>{console.log(error)});
    }
    res.send();
  }

};

