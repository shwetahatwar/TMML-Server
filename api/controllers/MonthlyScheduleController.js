/**
 * MonthlyScheduleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function(req,res){
    for(var i=0;i<req.body.monthlySchedule.length;i++){
      var newPartNumber = await PartNumber.find({
        partNumber:req.body.monthlySchedule[i].PartNumber
      });
      var d = new Date();
    // console.log(sensor);
    var curr_date = d.getDate();
    var curr_month = parseInt(d.getMonth()) + 1;
    curr_month = ""+curr_month;
    // console.log(curr_month);
    if(curr_month.toString().length == 1){
      curr_month = "0" + curr_month
    }
    // console.log(curr_month);
    var curr_year = d.getFullYear();
    var scheduleName = "Machine Shop Monthly Plan";
    scheduleName = scheduleName +" "+ curr_year +"-"+ curr_month;
      console.log(scheduleName);
      var mothlySchdeuleId = await MonthlySchedule.create({
        year:req.body.monthlySchedule[i].Year,
        month:req.body.monthlySchedule[i].Month,
        //scheduleName:req.body.monthlySchedule[i].scheduleName,
        scheduleName:scheduleName,
        partNumber:newPartNumber[0]["id"],
        description:req.body.monthlySchedule[i].Description,
        UOM:req.body.monthlySchedule[i].UOM,
        proc:req.body.monthlySchedule[i].Proc,
        EP:req.body.monthlySchedule[i].EPStoreLocation,
        issueLoc:req.body.monthlySchedule[i].IssueLocChessie,
        requiredInMonth:req.body.monthlySchedule[i].RequiredInMonth,
        CAT:req.body.monthlySchedule[i].CAT
      })
      .catch(error=>{console.log(error)});
      console.log(mothlySchdeuleId);
    }
    res.send();
  }
};