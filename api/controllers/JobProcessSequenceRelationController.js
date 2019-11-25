/**
* JobProcessSequenceRelationController
*
* @description :: Server-side actions for handling incoming requests.
* @help        :: See https://sailsjs.com/docs/concepts/actions
*/

var fs  = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// var xmlParser = require("xml2json");
var convert = require('xml-js');

module.exports = {
  create: async function(req,res){
    //console.log("Line 9",req.body);
    var checkMachineStatus = await Machine.find({
      id:req.body.machineId
    });
    if(checkMachineStatus != null && checkMachineStatus != undefined){
      if(checkMachineStatus[0]["maintenanceStatus"] == "Available"){
        var jobCard = await JobCard.find({
          id:req.body.jobId
        });
        if(jobCard[0]!=null&&jobCard[0]!=undefined){
          //console.log(jobCard[0]["productionSchedulePartRelationId"]);
          var sequenceNumberNew = await JobProcessSequenceRelation.find({
            jobId:req.body.jobId,
          })
          .sort('id DESC');
          //console.log("Line 18",sequenceNumberNew);
          var newSequenceNumber;
          if(sequenceNumberNew[0]!=null&&sequenceNumberNew[0]!=undefined){
            newSequenceNumber = sequenceNumberNew[0]["sequenceNumber"];
          }
          else{
            newSequenceNumber=0;
          }
          var productionSchedulePartRelationId = await ProductionSchedulePartRelation.find({
            id:jobCard[0]["productionSchedulePartRelationId"]
          });
          var checkProcessSequence;
          if(newSequenceNumber==0){
            checkProcessSequence=1;
          }
          else{
            checkProcessSequence = newSequenceNumber;
          }
          // //console.log(productionSchedulePartRelationId);
          if(productionSchedulePartRelationId!=null&&productionSchedulePartRelationId!=undefined){
            //console.log(productionSchedulePartRelationId[0]);
            var processSequenceId = await ProcessSequence.find({
              partId:productionSchedulePartRelationId[0]["partNumberId"],
              sequenceNumber:checkProcessSequence,
              status:1
            });
            var addedSequencecNumber = parseInt(newSequenceNumber) + 1;
            //console.log("Line 44",addedSequencecNumber);
            if(processSequenceId[0]!=null && processSequenceId[0]!=undefined){
              //console.log(processSequenceId[0]);
              var newJobProcess = await JobProcessSequenceRelation.create({
                jobId:req.body.jobId,
                processSequenceId:processSequenceId[0]["id"],
                machineId:req.body.machineId,
                locationId:req.body.locationId,
                quantity:0,
                note:"",
                processStatus:'Start',
                startTime:Date.now(),
                endTime:0,
                duration:0,
                operatorId:req.body.operatorId,
                sequenceNumber:addedSequencecNumber
              })
              .fetch()
              .catch((error)=>{console.log(error)});
              //console.log("Line 63",newJobProcess);
              await Machine.update({
                id : req.body.machineId
              })
              .set({
                maintenanceStatus:"Occupied"
              });
              //console.log(newJobProcess);
              await JobCard.update({
                id:req.body.jobId
              })
              .set({
                jobcardStatus:"In Progress"
              });
              var getMachine = await Machine.findOne({
                id: req.body.machineId
              });
              if(getMachine["isAutomacticCount"] == 1){
                await MachineStrokes.create({
                  machineId:req.body.machineId,
                  strokes:0,
                  startTime:Date.now(),
                  endTime:0,
                  multifactor:req.body.multifactor
                });
              }
              res.send(newJobProcess);
              var sourceLocation = await Location.find({
                barcodeSerial:req.body.sourceLocation
              });
              var jobLocationRelationId = await Joblocationrelation.findOne({
                jobcardId:req.body.jobId,
                processStatus:"Pending",
                sourceLocation:sourceLocation["id"]
              });
              if(jobLocationRelationId!=null&&jobLocationRelationId!=undefined){
                await Joblocationrelation.update({
                  id:jobLocationRelationId["id"]
                })
                .set({
                  destinationLocationId:req.body.machineId,
                  processStatus:"Complete"
                });
              }
            }
            else{
              res.send("Process Sequence not found");
            }
          }
          else{
            res.send("Production Schedule Part Relation Not Found");
          }
        }
        else{
          res.send("Job Card Not Found");
        }
      }
      else{
        res.send("Machine Not Available");
      }
    }
  },

  update: async function(req,res){
    //console.log("Line 133",req.body);
    if(req.body.machineStrockId != null && req.body.machineStrockId != undefined){
      await MachineStrokes.update({
        id:req.body.machineStrockId
      })
      .set({
        endTime:Date.now()
      });
    }
    var newJobProcessSequenceId = await JobProcessSequenceRelation.find({
      jobId:req.body.jobId,
      machineId:req.body.machineId,
      endTime:0
    });
    // //console.log("Line 112",newJobProcessSequenceId[0]["id"]);
    if(newJobProcessSequenceId[0] != null && newJobProcessSequenceId[0] != undefined){
      var machineBarcode = await Machine.find({
        id:req.body.machineId
      });
      var newLocationBarcode = await Location.find({
        barcodeSerial:machineBarcode[0]["barcodeSerial"]
      });
      var newJobProcess = await JobProcessSequenceRelation.update({
        id:newJobProcessSequenceId[0]["id"]
      })
      .set({
        quantity:req.body.quantity,
        processStatus:req.body.processStatus,
        duration:req.body.duration,
        locationId:newLocationBarcode[0]["id"],
        note:req.body.note,
        endTime:Date.now()
      })
      .fetch();
      // //console.log(newJobProcess);
      await Machine.update({
        id : req.body.machineId
      })
      .set({
        maintenanceStatus:"Available"
      });
      //console.log("Line 138",newJobProcessSequenceId[0]["processSequenceId"]);
      var newPartNumberId = await ProcessSequence.find({
        id:newJobProcessSequenceId[0]["processSequenceId"],
        status:1
      });
      var sequenceNumber = parseInt(newJobProcessSequenceId[0]["sequenceNumber"]) + 1;
      //console.log("Line 140",sequenceNumber);
      var processSequence = await ProcessSequence.find({
        // id:newJobProcessSequenceId[0]["processSequenceId"],
        sequenceNumber:sequenceNumber,
        partId:newPartNumberId[0]["partId"],
        status:1
      });
      //console.log("Line 145",processSequence[0]);
      if(processSequence[0]!=null&&processSequence[0]!=undefined){

        var machineGroups = await MachineGroup.find({
          id:processSequence[0]["machineGroupId"]
        })
        .populate("machines");
        //console.log("Line 191",machineGroups[0]);
        var suggestedLocations="";
        for(var i=0;i<machineGroups[0]["machines"].length;i++){
          suggestedLocations = suggestedLocations + "," + machineGroups[0]["machines"][i]["machineName"];
        }
        //console.log("Line 196",req.body.jobId);
        await Joblocationrelation.create({
          jobcardId:req.body.jobId,
          jobProcessSequenceRelationId:newJobProcessSequenceId[0]["id"],
          sourceLocation:newLocationBarcode[0]["id"],
          suggestedDropLocations:suggestedLocations,
          processStatus:"Pending"
        });
        res.send(newJobProcessSequenceId[0]);
      }
      else{
        var newJobProcess = await JobProcessSequenceRelation.update({
          id:newJobProcessSequenceId[0]["id"]
        })
        .set({
          processStatus:"FinalLocation",
        })
        .fetch();
        await JobProcessSequenceTransaction.create({
          jobCardId:req.body.jobId,
          jobProcessSequenceRelation:newJobProcessSequenceId[0]["id"],
          quantity:req.body.quantity
        });
        var machineBarcode = await Machine.find({
          id:req.body.machineId
        });
        var newLocationBarcode = await Location.find({
          barcodeSerial:machineBarcode[0]["barcodeSerial"]
        });
        await Joblocationrelation.create({
          jobcardId:req.body.jobId,
          jobProcessSequenceRelationId:0,
          sourceLocation:newLocationBarcode[0]["id"],
          suggestedDropLocations:"Store",
          processStatus:"Pending"
        });
        var jobCardBarcode = await JobCard.find({
          id:req.body.jobId
        });
        var pendingQty=jobCardBarcode[0]["actualQuantity"];
        var requestedQty=jobCardBarcode[0]["requestedQuantity"];
        var jobProcessSequenceRelation = await JobProcessSequenceRelation.find({
          jobId:req.body.jobId
        });
        var processSequence = await ProcessSequence.find({
          id:jobProcessSequenceRelation[0]["processSequenceId"],
          status:1
        });
        var partNumber = await PartNumber.find({
          id:processSequence[0]["partId"]
        });

        var totalQty = pendingQty + req.body.quantity;
        // if( totalQty <= requestedQty) {
        console.log("JobCard ID :",req.body.jobId);
        var updatedJobCard = await JobCard.update({
          id:req.body.jobId
        })
        .set({
          jobcardStatus:"Completed",
          actualQuantity:totalQty
        });
        console.log("Line 268 :",req.body.jobId);
        // var dateTime = new Date();
        var uniqueNumberSap;
        var sapEntry = await SapTransaction.find({
          where:{
            plant:"7002"
          },
          select: ['id','uniqueNumber']
        })
        .sort('uniqueNumber DESC');
        if(sapEntry[0] != null && sapEntry[0] != undefined){
          uniqueNumberSap = sapEntry[0]["uniqueNumber"];
          uniqueNumberSap = sapEntry[0]["uniqueNumber"];
          var serialNumberSapStart = uniqueNumberSap.substring(0,2);
          var serialNumberSapEnd = uniqueNumberSap.substring(2,8);
          if(serialNumberSapEnd == "999999"){
            var serialNumberSapFirstStart = serialNumberSapStart.substring(0,1);
            var serialNumberSapLastStart = serialNumberSapStart.substring(1,2);
            var serialNumberSapLatest;
            if(serialNumberSapLastStart == 'Z'){
              serialNumberSapLatest = String.fromCharCode(serialNumberSapFirstStart.charCodeAt() + 1);
              serialNumberSapLatest = serialNumberSapLatest + 'A';
              console.log(serialNumberSapLatest);
            }
            else{
              serialNumberSapLatest = String.fromCharCode(serialNumberSapLastStart.charCodeAt() + 1);
              serialNumberSapLatest = serialNumberSapFirstStart + serialNumberSapLatest;
            }
            uniqueNumberSap = serialNumberSapLatest + "000001";
          }
          else{
            serialNumberSapEnd = parseInt(serialNumberSapEnd) + 1;
            var newQuantity = pad(serialNumberSapEnd, 6);
            uniqueNumberSap = serialNumberSapStart + newQuantity;
          }
        }
        else{
          uniqueNumberSap = "AA000001"
        }
        var dateTimeFormat;
        var d = new Date();
        var curr_date = d.getDate();
        if(curr_date.toString().length == 1){
          curr_date = "0" + curr_date
        }
        var curr_month = parseInt(d.getMonth()) + 1;
        curr_month = ""+curr_month;
        if(curr_month.toString().length == 1){
          curr_month = "0" + curr_month
        }
        var curr_year = d.getFullYear();
        curr_year = curr_year.toString();
        curr_year = curr_year.substring(2,4);
        //console.log(curr_year);
        dateTimeFormat = curr_date + "-" + curr_month + "-" + curr_year;
        //console.log(curr_year);
        // dateTimeFormat = curr_year + "-" + curr_month + "-" + curr_date;
        // dateTimeFormat = curr_date + "-" + curr_month + "-" + curr_year;
        var newPartNumberAdded = partNumber[0]["partNumber"];
        await SapTransaction.create({
          plant:"7002",
          date:dateTimeFormat,
          material:newPartNumberAdded,
          jobCard:jobCardBarcode[0]["barcodeSerial"],
          uniqueNumber:uniqueNumberSap,
          quantity:req.body.quantity,
          documentNumber: 0
        }).then({
       })
       .catch(async function (err){
         console.log("I am in catch");
          var serialNumberSapStart = uniqueNumberSap.substring(0,2);
          var serialNumberSapEnd = uniqueNumberSap.substring(2,8);
          if(serialNumberSapEnd == "999999"){
            var serialNumberSapFirstStart = serialNumberSapStart.substring(0,1);
            var serialNumberSapLastStart = serialNumberSapStart.substring(1,2);
            var serialNumberSapLatest;
            if(serialNumberSapLastStart == 'Z'){
              serialNumberSapLatest = String.fromCharCode(serialNumberSapFirstStart.charCodeAt() + 1);
              serialNumberSapLatest = serialNumberSapLatest + 'A';
              console.log(serialNumberSapLatest);
            }
            else{
              serialNumberSapLatest = String.fromCharCode(serialNumberSapLastStart.charCodeAt() + 1);
              serialNumberSapLatest = serialNumberSapFirstStart + serialNumberSapLatest;
            }
            uniqueNumberSap = serialNumberSapLatest + "000001";
          }
          else{
            serialNumberSapEnd = parseInt(serialNumberSapEnd) + 1;
            var newQuantity = pad(serialNumberSapEnd, 6);
            uniqueNumberSap = serialNumberSapStart + newQuantity;
          }
          await SapTransaction.create({
           plant:"7002",
           date:dateTimeFormat,
           material:newPartNumberAdded,
           jobCard:jobCardBarcode[0]["barcodeSerial"],
           uniqueNumber:uniqueNumberSap,
           quantity:req.body.quantity,
           documentNumber: 0
         })
       });
        await SapTransactionLog.create({
          plant:"7002",
          date:dateTimeFormat,
          material:newPartNumberAdded,
          jobCard:jobCardBarcode[0]["barcodeSerial"],
          uniqueNumber:uniqueNumberSap,
          quantity:req.body.quantity,
          documentNumber: 0
        });
        console.log("Line 285",sapEntry);
        await manualSapTransaction("7002",dateTimeFormat,newPartNumberAdded,jobCardBarcode[0]["barcodeSerial"],uniqueNumberSap,req.body.quantity);
        await PartNumber.update({
          id:processSequence[0]["partId"]
        })
        .set({
          remarks:req.body.note
        });

        res.send("Final Location");
      }
    }
    else{
      res.send("Job Sequence Relation not Found");
    }
  },
  getData:async function(req,res){
    var newJobProcessSequenceRelationJson=[];
    var skipVal = 0;
    if (req.query['skip']) {
      skipVal = req.query['skip'];
    }

    var jobProcessSequenceRelationNew = await JobProcessSequenceRelation.find({where:{
      processStatus: 'Start'
    },limit:100, skip: skipVal,sort: [{ id: 'DESC'}]}).populate('jobId')
    .populate('processSequenceId')
    .populate('machineId')
    .populate('locationId')
    .populate('operatorId');
    // for(var i=0;i<jobProcessSequenceRelationNew.length;i++){
    //   //console.log(jobProcessSequenceRelationNew[i]["processStatus"]);
    //   if(jobProcessSequenceRelationNew[i]["processStatus"]!="New"){
    //     newJobProcessSequenceRelationJson.push(jobProcessSequenceRelationNew[i]);
    //   }
    // }
    //console.log(newJobProcessSequenceRelationJson);

    res.send(jobProcessSequenceRelationNew);
  },
  stopProcess:async function(req,res){
    if(req.body.machineStrockId != null&& req.body.machineStrockId!=undefined){
      await MachineStrokes.update({
        id:req.body.machineStrockId
      })
      .set({
        endTime:Date.now()
      });
    }
    var newJobProcessSequenceId = await JobProcessSequenceRelation.find({
      jobId:req.body.jobId,
      machineId:req.body.machineId,
      endTime:0
    });
    // //console.log("Line 112",newJobProcessSequenceId[0]["id"]);
    var machineBarcode = await Machine.find({
      id:req.body.machineId
    });
    var newLocationBarcode = await Location.find({
      barcodeSerial:machineBarcode[0]["barcodeSerial"]
    });
    var newJobProcess = await JobProcessSequenceRelation.update({
      id:newJobProcessSequenceId[0]["id"]
    })
    .set({
      quantity:req.body.quantity,
      processStatus:req.body.processStatus,
      duration:req.body.duration,
      locationId:newLocationBarcode[0]["id"],
      note:req.body.note,
      endTime:Date.now()
    })
    .fetch();
    // //console.log(newJobProcess);
    await Machine.update({
      id : req.body.machineId
    })
    .set({
      maintenanceStatus:"Available"
    });
    var newJobProcess = await JobProcessSequenceRelation.update({
      id:newJobProcessSequenceId[0]["id"]
    })
    .set({
      processStatus:"FinalLocation",
    })
    .fetch();
    await JobProcessSequenceTransaction.create({
      jobCardId:req.body.jobId,
      jobProcessSequenceRelation:newJobProcessSequenceId[0]["id"],
      quantity:req.body.quantity
    });
    // await manualSapTransaction("7002",dateTimeFormat,newPartNumberAdded,jobCardBarcode[0]["barcodeSerial"],dateTime,quantity);
    var machineBarcode = await Machine.find({
      id:req.body.machineId
    });
    var newLocationBarcode = await Location.find({
      barcodeSerial:machineBarcode[0]["barcodeSerial"]
    });
    //console.log("Line 359",req.body.jobId);
    await Joblocationrelation.create({
      jobcardId:req.body.jobId,
      jobProcessSequenceRelationId:0,
      sourceLocation:newLocationBarcode[0]["id"],
      suggestedDropLocations:"Store",
      processStatus:"Pending"
    });
    var jobCardBarcode = await JobCard.find({
      id:req.body.jobId
    });
    var jobProcessSequenceRelation = await JobProcessSequenceRelation.find({
      jobId:req.body.jobId
    });
    var processSequence = await ProcessSequence.find({
      id:jobProcessSequenceRelation[0]["processSequenceId"],
      status:1
    });
    var partNumber = await PartNumber.find({
      id:processSequence[0]["partId"]
    });
    var updatedJobCard = await JobCard.update({
      id:req.body.jobId
    })
    .set({
      jobcardStatus:"Completed",
      actualQuantity:req.body.quantity
    });
    // var dateTime = new Date();
    var uniqueNumberSap;
    var sapEntry = await SapTransaction.find({
      where:{
        plant:"7002"
      },
      select: ['id','uniqueNumber']
    })
    .sort('uniqueNumber DESC');
    if(sapEntry[0] != null && sapEntry[0] != undefined){
      uniqueNumberSap = sapEntry[0]["uniqueNumber"];
      uniqueNumberSap = sapEntry[0]["uniqueNumber"];
      var serialNumberSapStart = uniqueNumberSap.substring(0,2);
      var serialNumberSapEnd = uniqueNumberSap.substring(2,8);
      if(serialNumberSapEnd == "999999"){
        var serialNumberSapFirstStart = serialNumberSapStart.substring(0,1);
        var serialNumberSapLastStart = serialNumberSapStart.substring(1,2);
        var serialNumberSapLatest;
        if(serialNumberSapLastStart == 'Z'){
          serialNumberSapLatest = String.fromCharCode(serialNumberSapFirstStart.charCodeAt() + 1);
          serialNumberSapLatest = serialNumberSapLatest + 'A';
          console.log(serialNumberSapLatest);
        }
        else{
          serialNumberSapLatest = String.fromCharCode(serialNumberSapLastStart.charCodeAt() + 1);
          serialNumberSapLatest = serialNumberSapFirstStart + serialNumberSapLatest;
        }
        uniqueNumberSap = serialNumberSapLatest + "000001";
      }
      else{
        serialNumberSapEnd = parseInt(serialNumberSapEnd) + 1;
        var newQuantity = pad(serialNumberSapEnd, 6);
        uniqueNumberSap = serialNumberSapStart + newQuantity;
      }
    }
    else{
      uniqueNumberSap = "AA000001"
    }
    var dateTimeFormat;
    var d = new Date();
    var curr_date = d.getDate();
    if(curr_date.toString().length == 1){
      curr_date = "0" + curr_date
    }
    var curr_month = parseInt(d.getMonth()) + 1;
    curr_month = ""+curr_month;
    if(curr_month.toString().length == 1){
      curr_month = "0" + curr_month
    }
    var curr_year = d.getFullYear();
    curr_year = curr_year.substring(2,4);
    //console.log(curr_year);
    dateTimeFormat = curr_date + "-" + curr_month + "-" + curr_year;
    // dateTimeFormat = curr_year + "-" + curr_month + "-" + curr_date;
    var newPartNumberAdded = partNumber[0]["partNumber"];
    await SapTransaction.create({
      plant:"7002",
      date:dateTimeFormat,
      material:newPartNumberAdded,
      jobCard:jobCardBarcode[0]["barcodeSerial"],
      uniqueNumber:uniqueNumberSap,
      quantity:req.body.quantity,
      documentNumber: 0
    }).then({
       })
       .catch(async function (err){
        console.log("I am in catch");
          var serialNumberSapStart = uniqueNumberSap.substring(0,2);
          var serialNumberSapEnd = uniqueNumberSap.substring(2,8);
          if(serialNumberSapEnd == "999999"){
            var serialNumberSapFirstStart = serialNumberSapStart.substring(0,1);
            var serialNumberSapLastStart = serialNumberSapStart.substring(1,2);
            var serialNumberSapLatest;
            if(serialNumberSapLastStart == 'Z'){
              serialNumberSapLatest = String.fromCharCode(serialNumberSapFirstStart.charCodeAt() + 1);
              serialNumberSapLatest = serialNumberSapLatest + 'A';
              console.log(serialNumberSapLatest);
            }
            else{
              serialNumberSapLatest = String.fromCharCode(serialNumberSapLastStart.charCodeAt() + 1);
              serialNumberSapLatest = serialNumberSapFirstStart + serialNumberSapLatest;
            }
            uniqueNumberSap = serialNumberSapLatest + "000001";
          }
          else{
            serialNumberSapEnd = parseInt(serialNumberSapEnd) + 1;
            var newQuantity = pad(serialNumberSapEnd, 6);
            uniqueNumberSap = serialNumberSapStart + newQuantity;
          }
          await SapTransaction.create({
           plant:"7002",
           date:dateTimeFormat,
           material:newPartNumberAdded,
           jobCard:jobCardBarcode[0]["barcodeSerial"],
           uniqueNumber:uniqueNumberSap,
           quantity:req.body.quantity,
           documentNumber: 0
         })
       });
    // console.log("Line 487",sapEntry);
    await manualSapTransaction("7002",dateTimeFormat,newPartNumberAdded,jobCardBarcode[0]["barcodeSerial"],uniqueNumberSap,req.body.quantity);
    await PartNumber.update({
      id:processSequence[0]["partId"]
    })
    .set({
      remarks:req.body.note
    });
    res.send("Final Location");
  },

  getMachineWiseData:async function(req,res){
    var limitCount = 100;
    var skipCount = 0;
    if (req.query.limit) {
      limitCount = req.query.limit;
    }
    if(req.query.skip){
      skipCount = req.query.skip;
    }
    if(req.query.Machine !=null && req.query.Machine != undefined){
      console.log("In getMachineWiseData");
      var jobCards = await JobProcessSequenceRelation.find({
        where:{ machineId : req.query.Machine},limit:limitCount,sort: [{ id: 'DESC'}],skip:skipCount
      }).populate('jobId')
      .populate('processSequenceId')
      .populate('machineId')
      .populate('locationId')
      .populate('operatorId');
    }
    res.send(jobCards);
  },

  getJobProcessSequenceRelation:async function(req,res){
    var limitCount = 100;
    var skipCount = 0;
    if (req.query.limit) {
      limitCount = req.query.limit;
    }
    if(req.query.skip){
      skipCount = req.query.skip;
    }
    if(req.query.updatedAtStart != null && req.query.updatedAtEnd != null ){
      var jobCards = await JobProcessSequenceRelation.find({
        where:{ updatedAt :{ '>=':req.query.updatedAtStart,'<=':req.query.updatedAtEnd},
        processStatus:"Completed",processStatus:"FinalLocation"
      },limit:limitCount,sort: [{ id: 'DESC'}],skip:skipCount
    }).populate('jobId')
    .populate('processSequenceId')
    .populate('machineId')
    .populate('locationId')
    .populate('operatorId');
  }
  res.send(jobCards);
},
};


async function manualSapTransaction(plantAdd,dateAdd,materialAdd,jobcardAdd,uniqueNumberAdd,quantityAdd){
  // jobcardAdd = jobcardAdd.substring(3,18);
  // uniqueNumberAdd = uniqueNumberAdd.substring(1,12);
  console.log("In Manual SAP",uniqueNumberAdd);
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open('POST', 'http://TDCSAPDAPPPRD.blr.telco.co.in:8001/sap/bc/srt/rfc/sap/zmp_web_prod_booking/570/zmp_web_prod_booking/zmp_web_prod_booking', true,"TMML_BRIOT","tml!06TML");
  xmlhttp.onreadystatechange = async function() {
    if (xmlhttp.readyState == 4) {
      var xml = xmlhttp.responseText;
      var result = convert.xml2json(xml, {compact: true, spaces: 4});
      var newJSON = JSON.parse(result);
      //console.log("Line 532", newJSON["soap-env:Envelope"]["soap-env:Body"]["n0:ZmpppProdBookingWebResponse"]);
      var resultData = newJSON["soap-env:Envelope"]["soap-env:Body"]["n0:ZmpppProdBookingWebResponse"]["ZwebOutput"]["item"][1];
      //console.log("Line 534",resultData);

      if(resultData["Zmblnr"]["_text"] != null && resultData["Zmblnr"]["_text"] != undefined && resultData["Zmblnr"]["_text"] != 0){
        var sapTransaction = await SapTransaction.update({
          uniqueNumber:resultData["Zbktxt"]["_text"],
          // jobCard:getJobCardCompleted["jobCard"]
          jobCard:jobcardAdd
        })
        .set({
          documentNumber:resultData["Zmblnr"]["_text"],
          documentYear:resultData["Zmjahr"]["_text"],
          remarks:resultData["Zremarks"]["_text"]
        });

        var dateTimeFormat;
        var d = new Date();
        var curr_date = d.getDate();
        if(curr_date.toString().length == 1){
          curr_date = "0" + curr_date
        }
        var curr_month = parseInt(d.getMonth()) + 1;
        curr_month = ""+curr_month;
        if(curr_month.toString().length == 1){
          curr_month = "0" + curr_month
        }
        var curr_year = d.getFullYear();
        curr_year = curr_year.toString();
        curr_year = curr_year.substring(2,4);
        //console.log(curr_year);
        dateTimeFormat = curr_date + "-" + curr_month + "-" + curr_year;

        await SapTransactionLog.create({
          plant:"7002",
          date:dateTimeFormat,
          material:materialAdd,
          jobCard:jobcardAdd,
          uniqueNumber:resultData["Zbktxt"]["_text"],
          quantity:quantityAdd,
          documentNumber:resultData["Zmblnr"]["_text"],
          documentYear:resultData["Zmjahr"]["_text"],
          remarks:resultData["Zremarks"]["_text"]
        });
      }
    }
  };

  xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
  var xml = fs.readFileSync('D:\\TMML\\BRiOT-TMML-Machine-Shop-Solution\\server\\v1.0.7\\api\\test\\xmlPOSTTextFile.xml', 'utf-8');

  xml = xml.replace("Plant",plantAdd);
  if(dateAdd != null && dateAdd != undefined){
    xml = xml.replace("Date",dateAdd);
    if(materialAdd != null && materialAdd != undefined){
      xml = xml.replace("MaterialNumber",materialAdd);
      if(jobcardAdd != null && jobcardAdd != undefined){
        xml = xml.replace("JobCardNo",jobcardAdd);
        if(uniqueNumberAdd != null && uniqueNumberAdd != undefined){
          xml = xml.replace("UniqueNumber",uniqueNumberAdd);
          if(quantityAdd != null && quantityAdd != undefined){
            xml = xml.replace("ComponentquantityComponent",quantityAdd);
            console.log("Line 250",xml);
            xmlhttp.send(xml);
          }
        }
      }
    }
  }
}

function pad(number, length) {
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}
