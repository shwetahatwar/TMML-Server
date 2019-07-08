/**
* MonthlyScheduleController
*
* @description :: Server-side actions for handling incoming requests.
* @help        :: See https://sailsjs.com/docs/concepts/actions
*/

module.exports = {
  create: async function(req,res){
    // var mothlySchdeuleId;
    // for(var i=0;i<req.body.monthlySchedule.length;i++){
    //   var newPartNumber = await PartNumber.find({
    //     partNumber:req.body.monthlySchedule[i].PartNumber
    //   });
    //   var d = new Date();
    //   var curr_date = d.getDate();
    //   var curr_month = parseInt(d.getMonth()) + 1;
    //   curr_month = ""+curr_month;
    //   if(curr_month.toString().length == 1){
    //     curr_month = "0" + curr_month
    //   }
    //   var curr_year = d.getFullYear();
    //   var scheduleName = "Machine Shop Monthly Plan";
    //   scheduleName = scheduleName +" "+ curr_year +"-"+ curr_month;
    //   console.log(scheduleName);
    //   var currentMonth;
    //   if(currentMonth == req.body.monthlySchedule[i].Month)
    //     currentMonth = req.body.monthlySchedule[i].Month;
    //   mothlySchdeuleId = await MonthlySchedule.create({
    //     year:req.body.monthlySchedule[i].Year,
    //     month:req.body.monthlySchedule[i].Month,
    //     scheduleName:scheduleName,
    //     partNumber:newPartNumber[0]["id"],
    //     description:req.body.monthlySchedule[i].Description,
    //     UOM:req.body.monthlySchedule[i].UOM,
    //     proc:req.body.monthlySchedule[i].Proc,
    //     EP:req.body.monthlySchedule[i].EPStoreLocation,
    //     issueLoc:req.body.monthlySchedule[i].IssueLocChessie,
    //     requiredInMonth:req.body.monthlySchedule[i].RequiredInMonth,
    //     CAT:req.body.monthlySchedule[i].CAT
    //   })
    //   .catch(error=>{console.log(error)});
    //   console.log(mothlySchdeuleId);
    // }
    // res.send();

    var scheduleName = "Machine Shop Monthly Plan";
    scheduleName = scheduleName +" "+ req.body.monthlySchedule[0].Year +"-"+ req.body.monthlySchedule[0].Month;
    var mothlyScheduleId = await MonthlySchedule.create({
      year:req.body.monthlySchedule[0].Year,
      month:req.body.monthlySchedule[0].Month,
      scheduleName:scheduleName
    })
    .fetch()
    .catch(error=>{console.log(error)});
    console.log(mothlyScheduleId);
    if(mothlyScheduleId!=null&&mothlyScheduleId!=undefined){
      for(var i=0;i<req.body.monthlySchedule.length;i++){
        var newPartNumber = await PartNumber.find({
          partNumber:req.body.monthlySchedule[i].PartNumber
        });
        if(newPartNumber!=null&&newPartNumber!=undefined){
          MonthlySchedulePartRelation.create({
            monthlyScheduleId:mothlyScheduleId["id"],
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
        }
      }
    }
    res.send(mothlyScheduleId);
  }
};