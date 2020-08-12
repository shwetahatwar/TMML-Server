/**
 * ProcesssequenceController
 * 
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */ 
var nodemailer = require ('nodemailer');
module.exports = {
  manaulProcessSequqenceUpdate: async function(req,res){
    var partNumberBulkUpload = await PartNumber.find({
      where: {partNumber: req.body.partNumber},
      select: ['id']
    });
    console.log("Line 14", partNumberBulkUpload);
    if(partNumberBulkUpload[0] != null && partNumberBulkUpload[0] != undefined){
      var productionSchedulePartRelation = await ProductionSchedulePartRelation.find({
        partNumberId:partNumberBulkUpload[0]["id"]
      });
      console.log("Line 19", productionSchedulePartRelation[0]);
      if(productionSchedulePartRelation[0] != null && productionSchedulePartRelation[0] != undefined){
        console.log("Line 21")
        var activeJobCard = await JobCard.find({
          productionSchedulePartRelationId:productionSchedulePartRelation[0]["id"],
          jobcardStatus : ['In Progress', 'New']
        });
        console.log("Line 25", activeJobCard);
        if(activeJobCard[0] != null && activeJobCard[0] != null){
          res.send("Active Job Card");
          sails.log.error("Job Card in progress for part number:",req.body.partNumber);
        }
        else{
          console.log("Line 30 else part");
          var manPower = req.body.manPower;
          var SMH = req.body.SMH;
          var rackLoc = req.body.rackLoc;
          var prodLoc = req.body.prodLoc;
          await PartNumber.update({
            partNumber:req.body.partNumber
          })
          .set({
            manPower:req.body.manPower,
            SMH:req.body.SMH,
            rackLoc : req.body.rackLoc,
            prodLoc : req.body.prodLoc
          });

          await ProcessSequence.update({
            partId:partNumberBulkUpload[0]["id"]
          })
          .set({
            status: 0
          });

          var j=1;
          var processName1 = req.body.process_1;
          var processLoding1 = req.body.loadingTimeP1;
          var processprocess1 = req.body.processTimeP1;
          var processunloading1 = req.body.unloadingTimeP1;
          var processcycle1 = req.body.CycleTimeP1;

          if(processName1 != 0)
          {
            await processCreate1(processName1,partNumberBulkUpload[0]["id"],j,processLoding1,processprocess1,processunloading1,processcycle1);
          }

          var processName2 = req.body.process_2;
          var processLoding2 = req.body.loadingTimeP2;
          var processprocess2 = req.body.processTimeP2;
          var processunloading2 = req.body.unloadingTimeP2;
          var processcycle2 = req.body.CycleTimeP2;
          j++;

          if(processName2 != 0){
            await processCreate1(processName2,partNumberBulkUpload[0]["id"],j,processLoding2,processprocess2,processunloading2,processcycle2);
          }

          var processName3 = req.body.process_3;
          var processLoding3 = req.body.loadingTimeP3;
          var processprocess3 = req.body.processTimeP3;
          var processunloading3 = req.body.unloadingTimeP3;
          var processcycle3 = req.body.CycleTimeP3;
          j++;

          console.log(processName3,processLoding3,processprocess3,processunloading3,processcycle3);
          if(processName3 != 0){
            await processCreate1(processName3,partNumberBulkUpload[0]["id"],j,processLoding3,processprocess3,processunloading3,processcycle3);
          }

          var processName4 = req.body.process_4;
          var processLoding4 = req.body.loadingTimeP4;
          var processprocess4 = req.body.processTimeP4;
          var processunloading4 = req.body.unloadingTimeP4;
          var processcycle4 = req.body.CycleTimeP4;
          j++;

          if(processName4 != 0){
            await processCreate1(processName4,partNumberBulkUpload[0]["id"],j,processLoding4,processprocess4,processunloading4,processcycle4);
          }

          var processName5 = req.body.process_5;
          var processLoding5 = req.body.loadingTimeP5;
          var processprocess5 = req.body.processTimeP5;
          var processunloading5 = req.body.unloadingTimeP5;
          var processcycle5 = req.body.CycleTimeP5;
          j++;

          if(processName5 != 0){
            await processCreate1(processName5,partNumberBulkUpload[0]["id"],j,processLoding5,processprocess5,processunloading5,processcycle5);
          }

          var processName6 = req.body.process_6;
          var processLoding6 = req.body.loadingTimeP6;
          var processprocess6 = req.body.processTimeP6;
          var processunloading6 = req.body.unloadingTimeP6;
          var processcycle6 = req.body.CycleTimeP6;
          j++;

          if(processName6 != 0){
            await processCreate1(processName6,partNumberBulkUpload[0]["id"],j,processLoding6,processprocess6,processunloading6,processcycle6);
          }

          var processName7 = req.body.process_7;
          var processLoding7 = req.body.loadingTimeP7;
          var processprocess7 = req.body.processTimeP7;
          var processunloading7 = req.body.unloadingTimeP7;
          var processcycle7 = req.body.CycleTimeP7;
          j++;

          if(processName7 != 0){
            await processCreate1(processName7,partNumberBulkUpload[0]["id"],j,processLoding7,processprocess7,processunloading7,processcycle7);
          }

          var processName8 = req.body.process_8;
          var processLoding8 = req.body.loadingTimeP8;
          var processprocess8 = req.body.processTimeP8;
          var processunloading8 = req.body.unloadingTimeP8;
          var processcycle8 = req.body.CycleTimeP8;
          j++;

          if(processName8 != 0){
            await processCreate1(processName8,partNumberBulkUpload[0]["id"],j,processLoding8,processprocess8,processunloading8,processcycle8);
          }

          var processName9 = req.body.process_9;
          var processLoding9 = req.body.loadingTimeP9;
          var processprocess9 = req.body.processTimeP9;
          var processunloading9 = req.body.unloadingTimeP9;
          var processcycle9 = req.body.CycleTimeP9;
          j++;

          if(processName9 != 0){
            await processCreate1(processName9,partNumberBulkUpload[0]["id"],j,processLoding9,processprocess9,processunloading9,processcycle9);
          }

          var processName10 = req.body.process_10;
          var processLoding10 = req.body.loadingTimeP10;
          var processprocess10 = req.body.processTimeP10;
          var processunloading10 = req.body.unloadingTimeP10;
          var processcycle10 = req.body.CycleTimeP10;
          j++;

          if(processName10 != 0){
            await processCreate1(processName10,partNumberBulkUpload[0]["id"],j,processLoding10,processprocess10,processunloading10,processcycle10);
          }
        }
      }
      else{
        console.log("Line 167",req.body.rackLoc,req.body.prodLoc)
       
        var manPower = req.body.manPower;
        var SMH = req.body.SMH;
        var rackLoc = req.body.rackLoc;
        var prodLoc = req.body.prodLoc;
         await PartNumber.update({
          partNumber:req.body.partNumber
        })
        .set({
          manPower:req.body.manPower,
          SMH:req.body.SMH,
          rackLoc: req.body.rackLoc,
          prodLoc: req.body.prodLoc
        });
        console.log("Line 184")
        await ProcessSequence.update({
          partId:partNumberBulkUpload[0]["id"]
        })
        .set({
          status: 0
        });

        var j=1;
        var processName1 = req.body.process_1;
        var processLoding1 = req.body.loadingTimeP1;
        var processprocess1 = req.body.processTimeP1;
        var processunloading1 = req.body.unloadingTimeP1;
        var processcycle1 = req.body.CycleTimeP1;

        if(processName1 != 0)
        {
          await processCreate1(processName1,partNumberBulkUpload[0]["id"],j,processLoding1,processprocess1,processunloading1,processcycle1);
        }

        var processName2 = req.body.process_2;
        var processLoding2 = req.body.loadingTimeP2;
        var processprocess2 = req.body.processTimeP2;
        var processunloading2 = req.body.unloadingTimeP2;
        var processcycle2 = req.body.CycleTimeP2;
        j++;

        if(processName2 != 0){
          await processCreate1(processName2,partNumberBulkUpload[0]["id"],j,processLoding2,processprocess2,processunloading2,processcycle2);
        }

        var processName3 = req.body.process_3;
        var processLoding3 = req.body.loadingTimeP3;
        var processprocess3 = req.body.processTimeP3;
        var processunloading3 = req.body.unloadingTimeP3;
        var processcycle3 = req.body.CycleTimeP3;
        j++;

        console.log(processName3,processLoding3,processprocess3,processunloading3,processcycle3);
        if(processName3 != 0){
          await processCreate1(processName3,partNumberBulkUpload[0]["id"],j,processLoding3,processprocess3,processunloading3,processcycle3);
        }

        var processName4 = req.body.process_4;
        var processLoding4 = req.body.loadingTimeP4;
        var processprocess4 = req.body.processTimeP4;
        var processunloading4 = req.body.unloadingTimeP4;
        var processcycle4 = req.body.CycleTimeP4;
        j++;

        if(processName4 != 0){
          await processCreate1(processName4,partNumberBulkUpload[0]["id"],j,processLoding4,processprocess4,processunloading4,processcycle4);
        }

        var processName5 = req.body.process_5;
        var processLoding5 = req.body.loadingTimeP5;
        var processprocess5 = req.body.processTimeP5;
        var processunloading5 = req.body.unloadingTimeP5;
        var processcycle5 = req.body.CycleTimeP5;
        j++;

        if(processName5 != 0){
          await processCreate1(processName5,partNumberBulkUpload[0]["id"],j,processLoding5,processprocess5,processunloading5,processcycle5);
        }

        var processName6 = req.body.process_6;
        var processLoding6 = req.body.loadingTimeP6;
        var processprocess6 = req.body.processTimeP6;
        var processunloading6 = req.body.unloadingTimeP6;
        var processcycle6 = req.body.CycleTimeP6;
        j++;

        if(processName6 != 0){
          await processCreate1(processName6,partNumberBulkUpload[0]["id"],j,processLoding6,processprocess6,processunloading6,processcycle6);
        }

        var processName7 = req.body.process_7;
        var processLoding7 = req.body.loadingTimeP7;
        var processprocess7 = req.body.processTimeP7;
        var processunloading7 = req.body.unloadingTimeP7;
        var processcycle7 = req.body.CycleTimeP7;
        j++;

        if(processName7 != 0){
          await processCreate1(processName7,partNumberBulkUpload[0]["id"],j,processLoding7,processprocess7,processunloading7,processcycle7);
        }

        var processName8 = req.body.process_8;
        var processLoding8 = req.body.loadingTimeP8;
        var processprocess8 = req.body.processTimeP8;
        var processunloading8 = req.body.unloadingTimeP8;
        var processcycle8 = req.body.CycleTimeP8;
        j++;

        if(processName8 != 0){
          await processCreate1(processName8,partNumberBulkUpload[0]["id"],j,processLoding8,processprocess8,processunloading8,processcycle8);
        }

        var processName9 = req.body.process_9;
        var processLoding9 = req.body.loadingTimeP9;
        var processprocess9 = req.body.processTimeP9;
        var processunloading9 = req.body.unloadingTimeP9;
        var processcycle9 = req.body.CycleTimeP9;
        j++;

        if(processName9 != 0){
          await processCreate1(processName9,partNumberBulkUpload[0]["id"],j,processLoding9,processprocess9,processunloading9,processcycle9);
        }

        var processName10 = req.body.process_10;
        var processLoding10 = req.body.loadingTimeP10;
        var processprocess10 = req.body.processTimeP10;
        var processunloading10 = req.body.unloadingTimeP10;
        var processcycle10 = req.body.CycleTimeP10;
        j++;

        if(processName10 != 0){
          await processCreate1(processName10,partNumberBulkUpload[0]["id"],j,processLoding10,processprocess10,processunloading10,processcycle10);
        }
      }
      res.send();
    }
    else{
      res.send("Part Not Found");
      sails.log.error("Part Number not Available",req.body.partNumber);
    }
  },
  bulkUpload: async function(req,res){

    var selfSignedConfig = {
      host: '128.9.24.24',
      port: 25
    };
    var transporter = nodemailer.createTransport(selfSignedConfig);

    //Part Number ProcessSequence
    console.log(req.body.partNumberProcessSequenceBulkUpload);
    var partNumberProcessSequenceBulkUpload = JSON.parse(req.body.partNumberProcessSequenceBulkUpload);
    var totalCountPartNumber = partNumberProcessSequenceBulkUpload.length;
    var totalAddedPartNumber = 0;
    var totalNotAddedPartNumber = [];
    var actionJobCardPartNumbers = [];
    var counttotalNotAddedPartNumber = 0;
    if(partNumberProcessSequenceBulkUpload != null && partNumberProcessSequenceBulkUpload != undefined){
      console.log("Line 14", partNumberProcessSequenceBulkUpload[0]);
      for(var i=0; i<partNumberProcessSequenceBulkUpload.length; i++){
        var partNumberBulkUpload = await PartNumber.find({
          where: {partNumber: partNumberProcessSequenceBulkUpload[i].partNumber},
          select: ['id']
        });
        if(partNumberBulkUpload[0] != null && partNumberBulkUpload[0] != undefined){
          totalAddedPartNumber++;
          var productionSchedulePartRelation = await ProductionSchedulePartRelation.find({
            partNumberId:partNumberBulkUpload[0]["id"]
          });
          if(productionSchedulePartRelation[0] != null && productionSchedulePartRelation != undefined){
            var activeJobCard = await JobCard.find({
              productionSchedulePartRelationId:productionSchedulePartRelation[0]["id"],
              jobcardStatus : ['In Progress', 'New'] 
            });
            if(activeJobCard[0] != null && activeJobCard[0] != null){
              actionJobCardPartNumbers.push(partNumberProcessSequenceBulkUpload[i].partNumber);
              sails.log.info("Active Job cards below for Partnumbers",actionJobCardPartNumbers);
            }
            else{
              var manPower = partNumberProcessSequenceBulkUpload[i].manPower;
              var SMH = partNumberProcessSequenceBulkUpload[i].SMH;
              await PartNumber.update({
                partNumber:partNumberProcessSequenceBulkUpload[i].partNumber
              })
              .set({
                manPower:partNumberProcessSequenceBulkUpload[i].manPower,
                SMH:partNumberProcessSequenceBulkUpload[i].SMH
              });
              sails.log.info("SMH & ManPower for part number"+partNumberProcessSequenceBulkUpload[i].partNumber+":"+partNumberProcessSequenceBulkUpload[i].manPower+"",partNumberProcessSequenceBulkUpload[i].SMH);
              await ProcessSequence.update({
                partId:partNumberBulkUpload[0]["id"]
              })
              .set({
                status: 0
              });

              var j=1;
              var processName1 = partNumberProcessSequenceBulkUpload[i].process_1;
              var processLoding1 = partNumberProcessSequenceBulkUpload[i].loadingTimeP1;
              var processprocess1 = partNumberProcessSequenceBulkUpload[i].processTimeP1;
              var processunloading1 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP1;
              var processcycle1 = partNumberProcessSequenceBulkUpload[i].CycleTimeP1;

              if(processName1 != null && processName1 != undefined)
              {
                await processCreate(processName1,partNumberBulkUpload[0]["id"],j,processLoding1,processprocess1,processunloading1,processcycle1);
              }

              var processName2 = partNumberProcessSequenceBulkUpload[i].process_2;
              var processLoding2 = partNumberProcessSequenceBulkUpload[i].loadingTimeP2;
              var processprocess2 = partNumberProcessSequenceBulkUpload[i].processTimeP2;
              var processunloading2 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP2;
              var processcycle2 = partNumberProcessSequenceBulkUpload[i].CycleTimeP2;
              j++;

              if(processName2 != null && processName2 != undefined){
                await processCreate(processName2,partNumberBulkUpload[0]["id"],j,processLoding2,processprocess2,processunloading2,processcycle2);
              }

              var processName3 = partNumberProcessSequenceBulkUpload[i].process_3;
              var processLoding3 = partNumberProcessSequenceBulkUpload[i].loadingTimeP3;
              var processprocess3 = partNumberProcessSequenceBulkUpload[i].processTimeP3;
              var processunloading3 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP3;
              var processcycle3 = partNumberProcessSequenceBulkUpload[i].CycleTimeP3;
              j++;

              console.log(processName3,processLoding3,processprocess3,processunloading3,processcycle3);
              if(processName3 != null && processName3 != undefined){
                await processCreate(processName3,partNumberBulkUpload[0]["id"],j,processLoding3,processprocess3,processunloading3,processcycle3);
              }

              var processName4 = partNumberProcessSequenceBulkUpload[i].process_4;
              var processLoding4 = partNumberProcessSequenceBulkUpload[i].loadingTimeP4;
              var processprocess4 = partNumberProcessSequenceBulkUpload[i].processTimeP4;
              var processunloading4 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP4;
              var processcycle4 = partNumberProcessSequenceBulkUpload[i].CycleTimeP4;
              j++;

              if(processName4 != null && processName4 != undefined){
                await processCreate(processName4,partNumberBulkUpload[0]["id"],j,processLoding4,processprocess4,processunloading4,processcycle4);
              }

              var processName5 = partNumberProcessSequenceBulkUpload[i].process_5;
              var processLoding5 = partNumberProcessSequenceBulkUpload[i].loadingTimeP5;
              var processprocess5 = partNumberProcessSequenceBulkUpload[i].processTimeP5;
              var processunloading5 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP5;
              var processcycle5 = partNumberProcessSequenceBulkUpload[i].CycleTimeP5;
              j++;

              if(processName5 != null && processName5 != undefined){
                await processCreate(processName5,partNumberBulkUpload[0]["id"],j,processLoding5,processprocess5,processunloading5,processcycle5);
              }

              var processName6 = partNumberProcessSequenceBulkUpload[i].process_6;
              var processLoding6 = partNumberProcessSequenceBulkUpload[i].loadingTimeP6;
              var processprocess6 = partNumberProcessSequenceBulkUpload[i].processTimeP6;
              var processunloading6 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP6;
              var processcycle6 = partNumberProcessSequenceBulkUpload[i].CycleTimeP6;
              j++;

              if(processName6 != null && processName6 != undefined){
                await processCreate(processName6,partNumberBulkUpload[0]["id"],j,processLoding6,processprocess6,processunloading6,processcycle6);
              }

              var processName7 = partNumberProcessSequenceBulkUpload[i].process_7;
              var processLoding7 = partNumberProcessSequenceBulkUpload[i].loadingTimeP7;
              var processprocess7 = partNumberProcessSequenceBulkUpload[i].processTimeP7;
              var processunloading7 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP7;
              var processcycle7 = partNumberProcessSequenceBulkUpload[i].CycleTimeP7;
              j++;

              if(processName7 != null && processName7 != undefined){
                await processCreate(processName7,partNumberBulkUpload[0]["id"],j,processLoding7,processprocess7,processunloading7,processcycle7);
              }

              var processName8 = partNumberProcessSequenceBulkUpload[i].process_8;
              var processLoding8 = partNumberProcessSequenceBulkUpload[i].loadingTimeP8;
              var processprocess8 = partNumberProcessSequenceBulkUpload[i].processTimeP8;
              var processunloading8 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP8;
              var processcycle8 = partNumberProcessSequenceBulkUpload[i].CycleTimeP8;
              j++;

              if(processName8 != null && processName8 != undefined){
                await processCreate(processName8,partNumberBulkUpload[0]["id"],j,processLoding8,processprocess8,processunloading8,processcycle8);
              }

              var processName9 = partNumberProcessSequenceBulkUpload[i].process_9;
              var processLoding9 = partNumberProcessSequenceBulkUpload[i].loadingTimeP9;
              var processprocess9 = partNumberProcessSequenceBulkUpload[i].processTimeP9;
              var processunloading9 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP9;
              var processcycle9 = partNumberProcessSequenceBulkUpload[i].CycleTimeP9;
              j++;

              if(processName9 != null && processName9 != undefined){
                await processCreate(processName9,partNumberBulkUpload[0]["id"],j,processLoding9,processprocess9,processunloading9,processcycle9);
              }

              var processName10 = partNumberProcessSequenceBulkUpload[i].process_10;
              var processLoding10 = partNumberProcessSequenceBulkUpload[i].loadingTimeP10;
              var processprocess10 = partNumberProcessSequenceBulkUpload[i].processTimeP10;
              var processunloading10 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP10;
              var processcycle10 = partNumberProcessSequenceBulkUpload[i].CycleTimeP10;
              j++;

              if(processName10 != null && processName10 != undefined){
                await processCreate(processName10,partNumberBulkUpload[0]["id"],j,processLoding10,processprocess10,processunloading10,processcycle10);
              }
            }
          }
          else{
            var manPower = partNumberProcessSequenceBulkUpload[i].manPower;
            var SMH = partNumberProcessSequenceBulkUpload[i].SMH;
            await PartNumber.update({
              partNumber:partNumberProcessSequenceBulkUpload[i].partNumber
            })
            .set({
              manPower:partNumberProcessSequenceBulkUpload[i].manPower,
              SMH:partNumberProcessSequenceBulkUpload[i].SMH
            });

            await ProcessSequence.update({
              partId:partNumberBulkUpload[0]["id"]
            })
            .set({
              status: 0
            });

            var j=1;
            var processName1 = partNumberProcessSequenceBulkUpload[i].process_1;
            var processLoding1 = partNumberProcessSequenceBulkUpload[i].loadingTimeP1;
            var processprocess1 = partNumberProcessSequenceBulkUpload[i].processTimeP1;
            var processunloading1 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP1;
            var processcycle1 = partNumberProcessSequenceBulkUpload[i].CycleTimeP1;

            if(processName1 != null && processName1 != undefined)
            {
              await processCreate(processName1,partNumberBulkUpload[0]["id"],j,processLoding1,processprocess1,processunloading1,processcycle1);
            }

            var processName2 = partNumberProcessSequenceBulkUpload[i].process_2;
            var processLoding2 = partNumberProcessSequenceBulkUpload[i].loadingTimeP2;
            var processprocess2 = partNumberProcessSequenceBulkUpload[i].processTimeP2;
            var processunloading2 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP2;
            var processcycle2 = partNumberProcessSequenceBulkUpload[i].CycleTimeP2;
            j++;

            if(processName2 != null && processName2 != undefined){
              await processCreate(processName2,partNumberBulkUpload[0]["id"],j,processLoding2,processprocess2,processunloading2,processcycle2);
            }

            var processName3 = partNumberProcessSequenceBulkUpload[i].process_3;
            var processLoding3 = partNumberProcessSequenceBulkUpload[i].loadingTimeP3;
            var processprocess3 = partNumberProcessSequenceBulkUpload[i].processTimeP3;
            var processunloading3 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP3;
            var processcycle3 = partNumberProcessSequenceBulkUpload[i].CycleTimeP3;
            j++;

            console.log(processName3,processLoding3,processprocess3,processunloading3,processcycle3);
            if(processName3 != null && processName3 != undefined){
              await processCreate(processName3,partNumberBulkUpload[0]["id"],j,processLoding3,processprocess3,processunloading3,processcycle3);
            }

            var processName4 = partNumberProcessSequenceBulkUpload[i].process_4;
            var processLoding4 = partNumberProcessSequenceBulkUpload[i].loadingTimeP4;
            var processprocess4 = partNumberProcessSequenceBulkUpload[i].processTimeP4;
            var processunloading4 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP4;
            var processcycle4 = partNumberProcessSequenceBulkUpload[i].CycleTimeP4;
            j++;

            if(processName4 != null && processName4 != undefined){
              await processCreate(processName4,partNumberBulkUpload[0]["id"],j,processLoding4,processprocess4,processunloading4,processcycle4);
            }

            var processName5 = partNumberProcessSequenceBulkUpload[i].process_5;
            var processLoding5 = partNumberProcessSequenceBulkUpload[i].loadingTimeP5;
            var processprocess5 = partNumberProcessSequenceBulkUpload[i].processTimeP5;
            var processunloading5 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP5;
            var processcycle5 = partNumberProcessSequenceBulkUpload[i].CycleTimeP5;
            j++;

            if(processName5 != null && processName5 != undefined){
              await processCreate(processName5,partNumberBulkUpload[0]["id"],j,processLoding5,processprocess5,processunloading5,processcycle5);
            }

            var processName6 = partNumberProcessSequenceBulkUpload[i].process_6;
            var processLoding6 = partNumberProcessSequenceBulkUpload[i].loadingTimeP6;
            var processprocess6 = partNumberProcessSequenceBulkUpload[i].processTimeP6;
            var processunloading6 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP6;
            var processcycle6 = partNumberProcessSequenceBulkUpload[i].CycleTimeP6;
            j++;

            if(processName6 != null && processName6 != undefined){
              await processCreate(processName6,partNumberBulkUpload[0]["id"],j,processLoding6,processprocess6,processunloading6,processcycle6);
            }

            var processName7 = partNumberProcessSequenceBulkUpload[i].process_7;
            var processLoding7 = partNumberProcessSequenceBulkUpload[i].loadingTimeP7;
            var processprocess7 = partNumberProcessSequenceBulkUpload[i].processTimeP7;
            var processunloading7 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP7;
            var processcycle7 = partNumberProcessSequenceBulkUpload[i].CycleTimeP7;
            j++;

            if(processName7 != null && processName7 != undefined){
              await processCreate(processName7,partNumberBulkUpload[0]["id"],j,processLoding7,processprocess7,processunloading7,processcycle7);
            }

            var processName8 = partNumberProcessSequenceBulkUpload[i].process_8;
            var processLoding8 = partNumberProcessSequenceBulkUpload[i].loadingTimeP8;
            var processprocess8 = partNumberProcessSequenceBulkUpload[i].processTimeP8;
            var processunloading8 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP8;
            var processcycle8 = partNumberProcessSequenceBulkUpload[i].CycleTimeP8;
            j++;

            if(processName8 != null && processName8 != undefined){
              await processCreate(processName8,partNumberBulkUpload[0]["id"],j,processLoding8,processprocess8,processunloading8,processcycle8);
            }

            var processName9 = partNumberProcessSequenceBulkUpload[i].process_9;
            var processLoding9 = partNumberProcessSequenceBulkUpload[i].loadingTimeP9;
            var processprocess9 = partNumberProcessSequenceBulkUpload[i].processTimeP9;
            var processunloading9 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP9;
            var processcycle9 = partNumberProcessSequenceBulkUpload[i].CycleTimeP9;
            j++;

            if(processName9 != null && processName9 != undefined){
              await processCreate(processName9,partNumberBulkUpload[0]["id"],j,processLoding9,processprocess9,processunloading9,processcycle9);
            }

            var processName10 = partNumberProcessSequenceBulkUpload[i].process_10;
            var processLoding10 = partNumberProcessSequenceBulkUpload[i].loadingTimeP10;
            var processprocess10 = partNumberProcessSequenceBulkUpload[i].processTimeP10;
            var processunloading10 = partNumberProcessSequenceBulkUpload[i].unloadingTimeP10;
            var processcycle10 = partNumberProcessSequenceBulkUpload[i].CycleTimeP10;
            j++;

            if(processName10 != null && processName10 != undefined){
              await processCreate(processName10,partNumberBulkUpload[0]["id"],j,processLoding10,processprocess10,processunloading10,processcycle10);
            }
          }
        }
        else{
          counttotalNotAddedPartNumber++;
          totalNotAddedPartNumber.push(partNumberProcessSequenceBulkUpload[i].partNumber);
        }
      }
    }
    sails.log.info("Process Sequence Bulkupload Report : Total Parts Uploaded:- " + totalCountPartNumber + "\n Count of Parts Added Successfully:- " + totalAddedPartNumber + "\n Count of Parts Not Added:- " + counttotalNotAddedPartNumber + "\n Process Sequence Not Updated Due to Part Number Does not exist are as below:- ");
    var newEmployeeList = await Employee.find({
      notifyForMachineMaintenance:1
    });
    if(newEmployeeList[0]!=null&&newEmployeeList[0]!=undefined){
      var mailText = "Process Sequence Bulk Uploaded. \n Total Parts Uploaded:- " + totalCountPartNumber + "\n Count of Parts Added Successfully:- " + totalAddedPartNumber + "\n Count of Parts Not Added:- " + counttotalNotAddedPartNumber + "\n Process Sequence Not Updated Due to Part Number Does not exist are as below:- ";
      for(var i=0;i<totalNotAddedPartNumber.length;i++){
        mailText = mailText + "\n" + totalNotAddedPartNumber[i];
      }
      mailText = mailText + "\n Process Sequence Not Updated Due to Part Number Job Card in Pending/In Progess:-";
      for(var i=0;i<actionJobCardPartNumbers.length;i++){
        mailText = mailText + "\n" + actionJobCardPartNumbers[i];
      }
      console.log(mailText);
      for(var i=0;i<newEmployeeList.length;i++){
        var mailOptions = {
          from: "MachineShop_WIP@tatamarcopolo.com", // sender address (who sends)
          to: newEmployeeList[i].email, // list of receivers (who receives)
          subject: "Process Sequence Bulk Upload Status", // Subject line
          text: mailText
        };
        transporter.sendMail(mailOptions, function(error, info) {
          if(error){
            sails.log.error("Error while sending mail of Process sequence update",error);

          } else {
            sails.log.info('Message sent: ' + info.response);
          }
        });
      }
    }

    res.send();
  },

  find:async function(req,res){
    if  (req.query['status'] ) {
   }  else {
    req.query['status'] = 1;
   }
    var getProcessSequence = await ProcessSequence.find(req.query).populate('partId').populate('machineGroupId');
    res.send(getProcessSequence);
  }
};

async function processCreate(processName,newPartNumberId,count,processLoding,processprocess,processunloading,processcycle){
  console.log("In Process Create",processName,newPartNumberId,count,processLoding,processprocess,processunloading,processcycle);
  if(processName != null && processName != undefined){
      var machineGroupId = await MachineGroup.find({
        where: {name:processName},
        select: ['id']
      });
      if(machineGroupId[0] != null && machineGroupId[0] != undefined){
        // var getProcessSequence = await ProcessSequence.find({
        //   where: {
        //     partId:newPartNumberId,
        //     // sequenceNumber:count
        //   },
        //   select: ['id']
        // });
        // if(getProcessSequence[0] != null && getProcessSequence[0] != undefined){
          // if(processName == 0){
          //   await ProcessSequence.destroy({
          //     id:getProcessSequence[0]["id"]
          //   });
          // }
          // else{
          //   await ProcessSequence.update({
          //     id:getProcessSequence[0]["id"]
          //   })
          //   .set({
          //     loadingTime: processLoding,
          //     processTime:processprocess,
          //     unloadingTime:processunloading,
          //     cycleTime:processcycle,
          //     machineGroupId:machineGroupId[0]["id"]
          //   });
          // }
        // await ProcessSequence.update({
        //   partId:newPartNumberId
        // })
        // .set({
        //   status: 0
        // });
        // }
        // else{
        await ProcessSequence.create({
          partId:newPartNumberId,
          sequenceNumber:count,
          loadingTime: processLoding,
          processTime:processprocess,
          unloadingTime:processunloading,
          cycleTime:processcycle,
          machineGroupId:machineGroupId[0]["id"],
          isGroup:true,
          status:1
        })
        .catch(error=>{console.log(error)});
        console.log("line 142", machineGroupId);



        var newProcessSequenceId = await ProcessSequence.find({
          where: {
            partId:newPartNumberId,
            sequenceNumber:count,
            status:1
          },
          select: ['id']
        });
        sails.log.info(newProcessSequenceId);
        console.log("line 149",newProcessSequenceId);

        var machineGroupNew = await Machine.find()
        .populate('machineGroupId');
        // var machineGroupMachines = [];
        for(var i=0;i<machineGroupNew.length;i++){
          if(machineGroupId[0]["id"] == machineGroupNew[i]["machineGroupId"][0]["id"]){
            // machineGroupMachines.push(machineGroupNew[i]["machineName"]);
            await ProcessSequenceMachineRelation.create({
              processSequenceId:newProcessSequenceId[0]["id"],
              machineId:machineGroupNew[i]["id"]
            })
          }
        }
        // var machineGroupMachines = await Machine.find({where:{machineGroupId:machineGroupId[0]["id"]}});
        // console.log(machineGroupMachines);
        // for(var machineCount = 0;machineCount<machineGroupMachines.length;machineCount++){
        //   var machineIdValue;
        //   var newMachineId = await Machine.find({
        //     where: {machineName:machineGroupMachines[machineCount]["machineName"]},
        //     select: ['id']
        //   });
        //   if(newMachineId[0] != null && newMachineId[0] != undefined && newProcessSequenceId[0] != null && newProcessSequenceId[0] != undefined){
        //     await ProcessSequenceMachineRelation.create({
        //       processSequenceId:newProcessSequenceId[0]["id"],
        //       machineId:newMachineId[0]["id"]
        //     })
        //     .catch((error)=>{console.log(error)});
        //   }
        // }
        // }
      }
    }
}
async function processCreate1(processName,newPartNumberId,count,processLoding,processprocess,processunloading,processcycle){
  console.log("In Process Create",processName,newPartNumberId,count,processLoding,processprocess,processunloading,processcycle);
  if(processName != null && processName != undefined){
    await ProcessSequence.create({
      partId:newPartNumberId,
      sequenceNumber:count,
      loadingTime: processLoding,
      processTime:processprocess,
      unloadingTime:processunloading,
      cycleTime:processcycle,
      machineGroupId:processName,
      isGroup:true,
      status:1
    })
    .catch(error=>{console.log(error)});
    // console.log("line 142", machineGroupId);

    var newProcessSequenceId = await ProcessSequence.find({
      where: {
        partId:newPartNumberId,
        sequenceNumber:count,
        status:1
      },
      select: ['id']
    });
    sails.log.info(newProcessSequenceId);
    console.log("line 149",newProcessSequenceId);

    var machineGroupNew = await Machine.find()
    .populate('machineGroupId');
    // var machineGroupMachines = [];
    for(var i=0;i<machineGroupNew.length;i++){
      if(processName == machineGroupNew[i]["machineGroupId"][0]["id"]){
        // machineGroupMachines.push(machineGroupNew[i]["machineName"]);
        await ProcessSequenceMachineRelation.create({
          processSequenceId:newProcessSequenceId[0]["id"],
          machineId:machineGroupNew[i]["id"]
        })
      }
    }
  }
}
