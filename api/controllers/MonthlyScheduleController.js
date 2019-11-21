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
    var monthlySchedule = JSON.parse(req.body.monthlySchedule);
    var scheduleName = "Machine Shop Monthly Plan";
    var missingMonthlyParts = [];
    // console.log("Line no 48 MonthlySchedule" + req.body.monthlySchedule);
    scheduleName = scheduleName +" "+ monthlySchedule[0].Year +"-"+ monthlySchedule[0].Month;
    console.log("Line 50 MonthlySchedule", scheduleName);
    // if(req.body.monthlySchedule[0].Month.toString().length == 1){
    //  req.body.monthlySchedule[0].Month= "0" + req.body.monthlySchedule[0].Month
    // }
    // console.log(req.body.monthlySchedule[0].Month);
    var monthlySchedules = await MonthlySchedule.find({
      year:monthlySchedule[0].Year,
      month:monthlySchedule[0].Month,
    });
    var mothlyScheduleId;
    console.log("line 60",monthlySchedules);
    if (monthlySchedules[0] != undefined && monthlySchedules[0] != null) {
      // res.send('Monthly schedule already exist!');
      // return;
      console.log("In If");
      monthlyScheduleId = monthlySchedules[0]["id"];
    }
    else {
      mothlyScheduleId = await MonthlySchedule.create({
        year:monthlySchedule[0].Year,
        month:monthlySchedule[0].Month,
        scheduleName:scheduleName
      })
      .fetch()
      .catch(error=>{console.log(error)});
    }
    // console.log(monthlyScheduleId[0]);
    if(monthlyScheduleId!=null&&monthlyScheduleId!=undefined){
      for(var i=0;i<monthlySchedule.length;i++){
        console.log(monthlySchedule[i]);
        var newPartNumber = await PartNumber.find({
          partNumber:monthlySchedule[i].PartNumber
          // partNumber:req.body.monthlySchedule[i].Description
        });
        console.log(newPartNumber);
        if(newPartNumber[0]!=null&&newPartNumber[0]!=undefined){
          MonthlySchedulePartRelation.create({
            monthlyScheduleId:monthlyScheduleId,
            partNumber:newPartNumber[0]["id"],
            description:monthlySchedule[i].Description,
            UOM:monthlySchedule[i].UOM,
            proc:monthlySchedule[i].Proc,
            EP:monthlySchedule[i].EPStoreLocation,
            issueLoc:monthlySchedule[i].IssueLocChessie,
            requiredInMonth:monthlySchedule[i].RequiredInMonth,
            CAT:monthlySchedule[i].CAT
          })
          .catch(error=>{console.log(error)});
        }
        else{
           missingMonthlyParts.push(monthlySchedule[i].PartNumber);
          console.log('Part Numbers Not found: ', missingMonthlyParts.toString());
        }

      }
    }
    res.send(mothlyScheduleId);
  }
};
