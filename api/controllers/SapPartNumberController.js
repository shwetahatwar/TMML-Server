/**
* SapPartNumberControllerController
*
* @description :: Server-side actions for handling incoming requests.
* @help        :: See https://sailsjs.com/docs/concepts/actions
*/

var fs  = require('fs');
var nodemailer = require ('nodemailer');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// var xmlParser = require("xml2json");
var convert = require('xml-js');

module.exports = {

  create : async function(req,res){

  },

  refreshPartData:async function(req,res){
    var newDateTimeNow;
    var toDateTimeNow;
    var a = parseInt(req.query.fromDate);
    var d = new Date(a);
    var curr_date = d.getDate();
    console.log("d",a,d);
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
    newDateTimeNow = curr_date + "." + curr_month + "." + curr_year;
    a = parseInt(req.query.toDate);
    d = new Date(a);
    curr_date = d.getDate();
    if(curr_date.toString().length == 1){
      curr_date = "0" + curr_date
    }
    var curr_month = parseInt(d.getMonth()) + 1;
    curr_month = ""+curr_month;
    if(curr_month.toString().length == 1){
      curr_month = "0" + curr_month
    }
    curr_year = d.getFullYear();
    curr_year = curr_year.toString();
    toDateTimeNow = curr_date + "." + curr_month + "." + curr_year;
    console.log(newDateTimeNow,toDateTimeNow);
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://TDCSAPDAPPPRD.blr.telco.co.in:8001/sap/bc/srt/rfc/sap/zmppp_ws_comp_dtls/570/zmppp_ws_comp_dtls/zmppp_ws_comp_dtls', true,"TMML_BRIOT","tml!06TML");
    xmlhttp.onreadystatechange = async function() {
      if (xmlhttp.readyState == 4) {
        var xml = xmlhttp.responseText;
        var result = convert.xml2json(xml, {compact: true, spaces: 4});
        var newJSON = JSON.parse(result);
        console.log("Line 27",newJSON["_attributes"]);
        var resultData = newJSON["soap-env:Envelope"]["soap-env:Body"]["n0:ZMPPP_COMP_DTL_WEBSERVICEResponse"]["ZCOMP_DTL"]["item"];
        console.log("resultData",resultData);
        for(var i =1;i<resultData.length;i++){
          console.log("resultData",resultData[i]["ZSTATUS"]["_text"])

            sails.log.info("NEW part DATA received from SAP: ",resultData.length);
            if(resultData[i]["ZSTATUS"]["_text"] == "N"){
              var newPartNumber = await PartNumber.find({
                partNumber : resultData[i]["ZIDNRK"]["_text"]
              });
              console.log("Line 72",newPartNumber);
              if(newPartNumber[0] != undefined && newPartNumber[0] != null){
                var newRawMaterialIdUpdated;
                if(resultData[i]["ZMATNR"]["_text"]){
                  var newRawMaterial = await RawMaterial.find({
                    rawMaterialNumber : resultData[i]["ZMATNR"]["_text"]
                  })
                  if(newRawMaterial[0] != null && newRawMaterial[0] != undefined){
                    newRawMaterialIdUpdated = newRawMaterial[0]["id"];
                    var newRawMaterial = await RawMaterial.update({
                      rawMaterialNumber : resultData[i]["ZMATNR"]["_text"]
                    }).set({
                      description: resultData[i]["ZMAKTX1"]["_text"],
                    });
                  }
                  else{
                    var newRawMaterialId = await RawMaterial.create({
                      rawMaterialNumber: resultData[i]["ZMATNR"]["_text"],
                      description: resultData[i]["ZMAKTX1"]["_text"],
                      uom: resultData[i]["ZMEINS"]["_text"],
                      remarks: "",
                      status:1,
                      materialTypeId:1
                    })
                    .fetch();
                    newRawMaterialIdUpdated = newRawMaterialId["id"];
                  }
                }
                else if(!resultData[i]["ZMATNR"]["_text"]){
                  var newRawMaterial = await RawMaterial.find({
                    rawMaterialNumber : 'N/A',
                    description:'Description N/A in SAP'
                  })
                  if(newRawMaterial[0] != null && newRawMaterial[0] != undefined){
                    newRawMaterialIdUpdated = newRawMaterial[0]["id"];
                  }
                }

                var newLocationId;
                var newLocation = await Location.find({
                  name:resultData[i]["ZLGFSB"]["_text"]
                });
                if(newLocation[0] != null && newLocation[0] != undefined){
                  console.log(newLocation);
                  newLocationId = newLocation[0]["id"]
                }
                else {
                  await Location.create({
                    name:resultData[i]["ZLGFSB"]["_text"],
                    barcodeSerial:Date.now(),
                    locationType:'Kanban Location'
                  });
                  var newLocation1 = await Location.find({
                    name:resultData[i]["ZLGFSB"]["_text"]
                  });
                  newLocationId = newLocation1[0]["id"]
                }

                let rackLoc = "";
                if(resultData[i]["ZRACKLOC"]["_text"]){
                  rackLoc = resultData[i]["ZRACKLOC"]["_text"]
                }
                let prodLoc = "";
                if(resultData[i]["ZLGPRO"]["_text"]){
                  prodLoc = resultData[i]["ZLGPRO"]["_text"]
                }
            // console.log("newRawMaterialIdUpdated",newRawMaterialIdUpdated);
            var partNumber = await PartNumber.update({
              partNumber:resultData[i]["ZIDNRK"]["_text"]
            })
            .set({
              description:resultData[i]["ZMAKTX"]["_text"],
              partCreationDate:resultData[i]["ZANDAT1"]["_text"],
              partChangeDate:resultData[i]["ZAEDAT"]["_text"],
              partStatus:resultData[i]["ZSTATUS"]["_text"],
              uom:resultData[i]["ZMEINS"]["_text"],
              materialGroup:resultData[i]["ZMATKL"]["_text"],
              rawMaterialId:newRawMaterialIdUpdated,
              kanbanLocation : newLocationId,
              rackLoc :rackLoc,
              prodLoc :prodLoc
            });
            sails.log.info("Updated Data By SAP ",partNumber);
          }
          else{
            var newRawMaterial;
            console.log("Desc",resultData[i]["ZMATNR"]["_text"])
            if(resultData[i]["ZMATNR"]["_text"]){
              newRawMaterial = await RawMaterial.find({
                rawMaterialNumber : resultData[i]["ZMATNR"]["_text"]
              });
            }
            console.log("RawMaterial",newRawMaterial[0]);
            if(newRawMaterial[0]){
              console.log("Part Number is :-", resultData[i]["ZIDNRK"]);
              var newLocationId;
              var newLocation = await Location.find({
                name:resultData[i]["ZLGFSB"]["_text"]
              });
              if(newLocation[0] != null && newLocation[0] != undefined){
                console.log(newLocation);
                newLocationId = newLocation[0]["id"]
              }
              else {
                await Location.create({
                  name:resultData[i]["ZLGFSB"]["_text"],
                  barcodeSerial:Date.now(),
                  locationType:'Kanban Location'
                });
                var newLocation1 = await Location.find({
                  name:resultData[i]["ZLGFSB"]["_text"]
                });
                newLocationId = newLocation1[0]["id"]
              }
              var newPartNumber1 = await PartNumber.create({
                partNumber:resultData[i]["ZIDNRK"]["_text"],
                description:resultData[i]["ZMAKTX"]["_text"],
                partCreationDate:resultData[i]["ZANDAT1"]["_text"],
                partChangeDate:resultData[i]["ZAEDAT"]["_text"],
                partStatus:resultData[i]["ZSTATUS"]["_text"],
                uom:resultData[i]["ZMEINS"]["_text"],
                materialGroup:resultData[i]["ZMATKL"]["_text"],
                rawMaterialId : newRawMaterial[0]["id"],
                status : 1,
                jcCreateStatus:1,
                rackLoc :resultData[i]["ZRACKLOC"]["_text"],
                prodLoc :resultData[i]["ZLGPRO"]["_text"],
                kanbanLocation : newLocationId
              })
              .fetch();
              console.log("newPartNumber", newPartNumber1[0]);
              console.log("newPartNumber", newPartNumber1[0]);
              if(newPartNumber1){
                var selfSignedConfig = {
                  host: '128.9.24.24',
                  port: 25
                };
                var transporter = nodemailer.createTransport(selfSignedConfig);
                var mailText = "New Part Added into Software by SAP, Please upload process sequence for the same. ";
                mailText = mailText + "\n Part Number: " + newPartNumber1["partNumber"];
                mailText = mailText + "\n Part Description: " + newPartNumber1["description"];
                var mailOptions = {
                   from: "MachineShop_WIP@tatamarcopolo.com", // sender address (who sends)
                   to:"santosh.adaki@tatamarcopolo.com;ashishm@tatamotors.com;santosh.arishinakar@tatamarcopolo.com",
                   subject: "NEW part added by SAP", // Subject line
                   text: mailText,
                 };
                 transporter.sendMail(mailOptions, function(error, info) {
                   if(error){
                     sails.log.error("NewParts-Added mail not sent",error);
                   } else {
                     sails.log.info('NewParts-Added Message sent: ' + info.response);
                   }
                 });
               }
               sails.log.info("NEW part added by SAP: ",newPartNumber1[0]);
                // break;
              }
              else{
                var newRawMaterialIdUpdated;
                if(!resultData[i]["ZMATNR"]["_text"]){
                  var newRawMaterial = await RawMaterial.find({
                    rawMaterialNumber : 'N/A',
                    description:'Description N/A in SAP'
                  })
                  if(newRawMaterial[0] != null && newRawMaterial[0] != undefined){
                    newRawMaterialIdUpdated = newRawMaterial[0]["id"];
                  }
                }
                else{
                  var newRawMaterialId = await RawMaterial.create({
                    rawMaterialNumber: resultData[i]["ZMATNR"]["_text"],
                    description: resultData[i]["ZMAKTX1"]["_text"],
                    uom: resultData[i]["ZMEINS"]["_text"],
                    remarks: "",
                    status:1,
                    materialTypeId:1
                  })
                  .fetch();
                  console.log("Part Number is :-", resultData[i]["ZIDNRK"]);

                  newRawMaterialIdUpdated = newRawMaterialId["id"];
                }
                var newLocationId;
                var newLocation = await Location.find({
                  name:resultData[i]["ZLGFSB"]["_text"]
                });
                if(newLocation[0] != null && newLocation[0] != undefined){
                  console.log(newLocation);
                  newLocationId = newLocation[0]["id"]
                }
                else {
                  await Location.create({
                    name:resultData[i]["ZLGFSB"]["_text"],
                    barcodeSerial:Date.now(),
                    locationType:'Kanban Location'
                  });
                  var newLocation1 = await Location.find({
                    name:resultData[i]["ZLGFSB"]["_text"]
                  });
                  newLocationId = newLocation1[0]["id"]
                }
                var newPartNumber1 = await PartNumber.create({
                  partNumber:resultData[i]["ZIDNRK"]["_text"],
                  description:resultData[i]["ZMAKTX"]["_text"],
                  partCreationDate:resultData[i]["ZANDAT1"]["_text"],
                  partChangeDate:resultData[i]["ZAEDAT"]["_text"],
                  partStatus:resultData[i]["ZSTATUS"]["_text"],
                  uom:resultData[i]["ZMEINS"]["_text"],
                  materialGroup:resultData[i]["ZMATKL"]["_text"],
                  rawMaterialId : newRawMaterialIdUpdated,
                  status : 1,
                  jcCreateStatus:1,
                  rackLoc :resultData[i]["ZRACKLOC"]["_text"],
                  prodLoc :resultData[i]["ZLGPRO"]["_text"],
                  kanbanLocation : newLocationId
                })
                .fetch();
                console.log("newPartNumber", newPartNumber1[0]);
                console.log("newPartNumber", newPartNumber1[0]);
                if(newPartNumber1){
                  var selfSignedConfig = {
                    host: '128.9.24.24',
                    port: 25
                  };
                  var transporter = nodemailer.createTransport(selfSignedConfig);
                  var mailText = "New Part Added into Software by SAP, Please upload process sequence for the same. ";
                  mailText = mailText + "\n Part Number: " + newPartNumber1["partNumber"];
                  mailText = mailText + "\n Part Description: " + newPartNumber1["description"];
                  var mailOptions = {
                 from: "MachineShop_WIP@tatamarcopolo.com", // sender address (who sends)
                 to:"santosh.adaki@tatamarcopolo.com;ashishm@tatamotors.com;santosh.arishinakar@tatamarcopolo.com",
                 subject: "NEW part added by SAP", // Subject line
                 text: mailText,
               };
               transporter.sendMail(mailOptions, function(error, info) {
                 if(error){
                   sails.log.error("NewParts-Added mail not sent",error);
                 } else {
                   sails.log.info('NewParts-Added Message sent: ' + info.response);
                 }
               });
             }
             sails.log.info("NEW part added by SAP: ",newPartNumber1[0]);
           }
         }
       }
       else if(resultData[i]["ZSTATUS"]["_text"] == "C"){
         var newRawMaterialIdUpdated;
         if(resultData[i]["ZMATNR"]["_text"]){
           var newRawMaterial = await RawMaterial.find({
             rawMaterialNumber : resultData[i]["ZMATNR"]["_text"]
           })
           if(newRawMaterial[0] != null && newRawMaterial[0] != undefined){
             newRawMaterialIdUpdated = newRawMaterial[0]["id"];
             var newRawMaterial = await RawMaterial.update({
               rawMaterialNumber : resultData[i]["ZMATNR"]["_text"]
             }).set({
               description: resultData[i]["ZMAKTX1"]["_text"],
             });
           }
           else{
             var newRawMaterialId = await RawMaterial.create({
               rawMaterialNumber: resultData[i]["ZMATNR"]["_text"],
               description: resultData[i]["ZMAKTX1"]["_text"],
               uom: resultData[i]["ZMEINS"]["_text"],
               remarks: "",
               status:1,
               materialTypeId:1
             })
             .fetch();
             newRawMaterialIdUpdated = newRawMaterialId["id"];
           }
         }
         else if(!resultData[i]["ZMATNR"]["_text"]){
           var newRawMaterial = await RawMaterial.find({
             rawMaterialNumber : 'N/A',
             description:'Description N/A in SAP'
           })
           if(newRawMaterial[0] != null && newRawMaterial[0] != undefined){
             newRawMaterialIdUpdated = newRawMaterial[0]["id"];
           }
         }
         var newLocationId;
         var newLocation = await Location.find({
           name:resultData[i]["ZLGFSB"]["_text"]
         });
         if(newLocation[0] != null && newLocation[0] != undefined){
           console.log(newLocation);
           newLocationId = newLocation[0]["id"]
         }
         else {
           await Location.create({
             name:resultData[i]["ZLGFSB"]["_text"],
             barcodeSerial:Date.now(),
             locationType:'Kanban Location'
           });
           var newLocation1 = await Location.find({
             name:resultData[i]["ZLGFSB"]["_text"]
           });
           newLocationId = newLocation1[0]["id"]
         }
         let rackLoc = "";
         if(resultData[i]["ZRACKLOC"]["_text"]){
           rackLoc = resultData[i]["ZRACKLOC"]["_text"]
         }
         let prodLoc = "";
         if(resultData[i]["ZLGPRO"]["_text"]){
           prodLoc = resultData[i]["ZLGPRO"]["_text"]
         }
            // console.log("newRawMaterialIdUpdated",newRawMaterialIdUpdated);
            var partNumber = await PartNumber.update({
              partNumber:resultData[i]["ZIDNRK"]["_text"]
            })
            .set({
              description:resultData[i]["ZMAKTX"]["_text"],
              partCreationDate:resultData[i]["ZANDAT1"]["_text"],
              partChangeDate:resultData[i]["ZAEDAT"]["_text"],
              partStatus:resultData[i]["ZSTATUS"]["_text"],
              uom:resultData[i]["ZMEINS"]["_text"],
              materialGroup:resultData[i]["ZMATKL"]["_text"],
              rawMaterialId:newRawMaterialIdUpdated,
              kanbanLocation : newLocationId,
              rackLoc :rackLoc,
              prodLoc :prodLoc
            });
            sails.log.info("Updated Data By SAP ",partNumber);
          }
          else if(resultData[i]["ZSTATUS"]["_text"] == "B"){
            var partNumber =await PartNumber.update({
              partNumber:resultData[i]["ZIDNRK"]["_text"]
            })
            .set({
              partStatus:resultData[i]["ZSTATUS"]["_text"],
              status:0
            });
            sails.log.info("Updated Data By SAP Blocked",partNumber);
          }
          sails.log.info("SAP PARt",resultData[i]);
        }
        // res.send();
      }
    }

    xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
    var xml = fs.readFileSync('D:\\TMML\\BRiOT-TMML-Machine-Shop-Solution\\server\\v1.0.7\\api\\test\\xmlTextFile.xml', 'utf-8');
    xml = xml.replace("newDateNowAPI", newDateTimeNow);
    xml = xml.replace("toDateNowAPI", toDateTimeNow);
    console.log("xml 417",xml);
    sails.log.info("NEW part",xml);
    xmlhttp.send(xml);
    res.send('updated');
  },


  get313Status:async function(req,res){
    var sap315Status = await SapTransaction.find({
      jobCard: req.query.jobCard
    });
    if(sap315Status[0] != null && sap315Status[0] != undefined){
      if(sap315Status[0]["remarks"] != "" && sap315Status[0]["remarks"] != undefined){
        res.send(sap315Status[0]["remarks"]);
      }
      else{
        res.send("Job Card is completed but 313 is not yet done");
      }
    }
    else{
      var jobCardStatus = await JobCard.find({
        barcodeSerial: req.query.jobCard
      });
      if(jobCardStatus[0] != null && jobCardStatus[0] != undefined){
        var status = "Job Card Status is "+jobCardStatus[0]["jobcardStatus"];
        res.send(status);
      }
    }
  },
  soapRequestGet:async function(req,res){
    var d = new Date();
    var newDay = d.getDate();
    if(newDay.toString().length == 1)
      newDay = "0" + newDay;
    var newMonth = d.getMonth();
    if(newMonth.toString().length == 1)
      newMonth = "0" + newMonth;
    var newYear = d.getFullYear();
    var newDateTimeNow = newDay + "." + newMonth + "." + newYear;
    await newSapTransactionEntry(newDateTimeNow);
    res.send();
  },

  soapRequest1:async function(req,res){
    var xml = '<?xml version="1.0" encoding="UTF-8" ?><business><company>Code Blog</company><owner>Nic Raboy</owner><employee><firstname>Nic</firstname><lastname>Raboy</lastname></employee><employee><firstname>Maria</firstname><lastname>Campos</lastname></employee></business>';
    parseString(xml, function (err, result) {
      console.dir(JSON.stringify(result));
    });
  },

  soapRequestPost:async function(req,res){
    var getJobCardCompleted = await SapTransaction.find({
      documentNumber: 0
    });
    sails.log.info("getJobCardCompleted",getJobCardCompleted);
    sails.log.info("getJobCardCompleted length",getJobCardCompleted.length);
    if(getJobCardCompleted[0] != null && getJobCardCompleted[0] != undefined){
      for(var i=0; i < getJobCardCompleted.length; i++){
        if(getJobCardCompleted[i] != null && getJobCardCompleted[i] != undefined){
          await satTransactionEntry(getJobCardCompleted[i])
        }
      }
    }

  },

  parseJson:async function(req,res){
    var xml = fs.readFileSync('D:\\TMML\\BRiOT-TMML-Machine-Shop-Solution\\server\\v1.0.7\\api\\test\\test.xml', 'utf-8');

    var result = convert.xml2json(xml, {compact: true, spaces: 4});
    var newJSON = JSON.parse(result);
    console.log(newJSON["soap-env:Envelope"]["soap-env:Body"]["n0:ZMPPP_COMP_DTL_WEBSERVICEResponse"]["ZCOMP_DTL"]["item"]);

  },

  manualSapTransaction:async function(plantAdd,dateAdd,materialAdd,jobcardAdd,uniqueNumberAdd,quantityAdd){
    console.log("In Manual SAP");
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://eccauto.pune.telco.co.in:8000/sap/bc/srt/rfc/sap/zmp_web_prod_booking/170/zmp_web_prod_booking/zmp_web_prod_booking', true,"TMML_BRIOT","tml!06TML");
    xmlhttp.onreadystatechange = async function() {
      if (xmlhttp.readyState == 4) {
        var xml = xmlhttp.responseText;
        var result = convert.xml2json(xml, {compact: true, spaces: 4});
        var newJSON = JSON.parse(result);
        console.log("Line 214", newJSON["soap-env:Envelope"]["soap-env:Body"]["n0:ZmpppProdBookingWebResponse"]["ZwebOutput"]["item"][1]);
        var resultData = newJSON["soap-env:Envelope"]["soap-env:Body"]["n0:ZmpppProdBookingWebResponse"]["ZwebOutput"]["item"][1];
        console.log(resultData);

        if(resultData["Zmblnr"]["_text"] != null && resultData["Zmblnr"]["_text"] != undefined && resultData["Zmblnr"]["_text"] != 0){
          var sapTransaction = await SapTransaction.update({
            uniqueNumber:resultData["Zbktxt"]["_text"],
            jobCard:getJobCardCompleted["jobCard"]
          })
          .set({
            documentNumber:resultData["Zmblnr"]["_text"],
            documentYear:resultData["Zmjahr"]["_text"],
            remarks:resultData["Zremarks"]["_text"]
          });

          await SapTransactionLog.create({
            plant:"7002",
            date:dateAdd,
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

    xml = xml.replace("Plant",getJobCardCompleted[0]["plant"]);
    if(getJobCardCompleted[0]["date"]!= null && getJobCardCompleted[0]["date"]!=undefined){
      xml = xml.replace("Date",getJobCardCompleted[0]["date"]);
      if(getJobCardCompleted[0]["material"]!= null && getJobCardCompleted[0]["material"]!=undefined){
        xml = xml.replace("MaterialNumber",getJobCardCompleted[0]["material"]);
        if(getJobCardCompleted[0]["jobCard"]!= null && getJobCardCompleted[0]["jobCard"]!=undefined){
          xml = xml.replace("JobCardNo",getJobCardCompleted[0]["jobCard"]);
          if(getJobCardCompleted[0]["uniqueNumber"]!= null && getJobCardCompleted[0]["uniqueNumber"]!=undefined){
            xml = xml.replace("UniqueNumber",getJobCardCompleted[0]["uniqueNumber"]);
            if(getJobCardCompleted[0]["quantity"]!= null && getJobCardCompleted[0]["quantity"]!=undefined){
              xml = xml.replace("ComponentquantityComponent",getJobCardCompleted[0]["quantity"]);
              console.log("Line 250",xml);
              xmlhttp.send(xml);
            }
          }
        }
      }
    }
    res.send();
  },

  get313Data:async function(req,res){
    console.log("req.body: ",req.body);
    var sap315 = await SapTransaction.find({
      jobCard: req.body.jobCard
    });
    if(sap315[0] != null && sap315[0] != undefined){
      console.log("Line 132",sap315[0]["documentNumber"]);
      if(sap315[0]["documentNumber"] != 0 && sap315[0]["documentNumber"] != 1)
      {
        res.send(sap315);
      }
      else
      {
        if(sap315[0]["remarks"] == "")
        {
          res.status(424);
          res.send("313 is not done");
        }
        else
        {
          res.status(424);
          res.send(sap315[0]["remarks"]);
        }
      }
    }
    else
    {
      res.status(424);
      res.send("Job Card is not completed or 313 is not done");
    }
  }
};

async function satTransactionEntry(getJobCardCompleted){

  const xmlhttp = new XMLHttpRequest();
  // xmlhttp.open('POST', 'http://eccauto.pune.telco.co.in:8000/sap/bc/srt/rfc/sap/zmp_web_prod_booking/170/zmp_web_prod_booking/zmp_web_prod_booking', true,"TMML_BRIOT","tml!06TML");
  // xmlhttp.open('POST', 'http://TDCSAPDAPPPRD.blr.telco.co.in:8001/sap/bc/srt/rfc/sap/zmp_web_prod_booking/570/zmp_web_prod_booking/zmp_web_prod_booking', true,"TMML_BRIOT","tml!06TML");
  xmlhttp.open('POST', 'http://TDCSAPDAPPPRD.blr.telco.co.in:8001/sap/bc/srt/rfc/sap/zmp_web_prod_booking/570/zmp_web_prod_booking/zmp_web_prod_booking', true,"TMML_BRIOT","tml!06TML");
  xmlhttp.onreadystatechange = async function() {
    if (xmlhttp.readyState == 4) {
      var xml = xmlhttp.responseText;
      var result = convert.xml2json(xml, {compact: true, spaces: 4});
      var newJSON = JSON.parse(result);
      //console.log("Line 214", newJSON["soap-env:Envelope"]["soap-env:Body"]["n0:ZmpppProdBookingWebResponse"]["ZwebOutput"]["item"][1]);
      var resultData = newJSON["soap-env:Envelope"]["soap-env:Body"]["n0:ZmpppProdBookingWebResponse"]["ZwebOutput"]["item"][1];
      // var xmlItems = newJSON["ZwebOutput"];
      //console.log(resultData);
      sails.log.info(" \n resultData: ",resultData);
      if(resultData["Zmblnr"]["_text"] != null && resultData["Zmblnr"]["_text"] != undefined && resultData["Zmblnr"]["_text"] != 0){
        // for(var i =0;i<xmlItems.length;i++){
          var sapTransaction = await SapTransaction.update({
            uniqueNumber:resultData["Zbktxt"]["_text"],
            jobCard:getJobCardCompleted["jobCard"]
          })
          .set({
            documentNumber:resultData["Zmblnr"]["_text"],
            documentYear:resultData["Zmjahr"]["_text"],
            remarks:resultData["Zremarks"]["_text"]
          });
          await SapTransactionLog.create({
            plant:"7002",
            date:getJobCardCompleted["date"],
            material:getJobCardCompleted["material"],
            jobCard:getJobCardCompleted["jobCard"],
            uniqueNumber:resultData["Zbktxt"]["_text"],
            quantity:getJobCardCompleted["quantity"],
            documentNumber:resultData["Zmblnr"]["_text"],
            documentYear:resultData["Zmjahr"]["_text"],
            remarks:resultData["Zremarks"]["_text"]
          });
        // }
      }
      else if(resultData["Zremarks"]["_text"] == "Unique Number and Job Card already exists" || resultData["Zremarks"]["_text"] == "315 already done against this JC/ unique no combination"){
        var sapTransaction = await SapTransaction.update({
          uniqueNumber:resultData["Zbktxt"]["_text"],
          jobCard:getJobCardCompleted["jobCard"]
        })
        .set({
          documentNumber:1,
          documentYear:resultData["Zmjahr"]["_text"],
          remarks:resultData["Zremarks"]["_text"]
        });
        await SapTransactionLog.create({
          plant:"7002",
          date:getJobCardCompleted["date"],
          material:getJobCardCompleted["material"],
          jobCard:getJobCardCompleted["jobCard"],
          uniqueNumber:resultData["Zbktxt"]["_text"],
          quantity:getJobCardCompleted["quantity"],
          documentNumber:resultData["Zmblnr"]["_text"],
          documentYear:resultData["Zmjahr"]["_text"],
          remarks:resultData["Zremarks"]["_text"]
        });
      }
      else{
        var sapTransaction = await SapTransaction.update({
          uniqueNumber:resultData["Zbktxt"]["_text"],
          jobCard:getJobCardCompleted["jobCard"]
        })
        .set({
          documentNumber:0,
          documentYear:resultData["Zmjahr"]["_text"],
          remarks:resultData["Zremarks"]["_text"]
        });
        await SapTransactionLog.create({
          plant:"7002",
          date:getJobCardCompleted["date"],
          material:getJobCardCompleted["material"],
          jobCard:getJobCardCompleted["jobCard"],
          uniqueNumber:resultData["Zbktxt"]["_text"],
          quantity:getJobCardCompleted["quantity"],
          documentNumber:resultData["Zmblnr"]["_text"],
          documentYear:resultData["Zmjahr"]["_text"],
          remarks:resultData["Zremarks"]["_text"]
        });
      }
      await SapTransactionLog.create({
        plant:"7002",
        date:getJobCardCompleted["date"],
        material:getJobCardCompleted["material"],
        jobCard:getJobCardCompleted["jobCard"],
        uniqueNumber:getJobCardCompleted["uniqueNumber"],
        quantity:getJobCardCompleted["quantity"],
        documentNumber:"",
        documentYear:2019,
        remarks:"Not updated"
      });
    }
  };
  xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
  var xml = fs.readFileSync('D:\\TMML\\BRiOT-TMML-Machine-Shop-Solution\\server\\v1.0.7\\api\\test\\xmlPOSTTextFile.xml', 'utf-8');
  if(getJobCardCompleted != null && getJobCardCompleted != undefined){
    console.log("Line 389",getJobCardCompleted);
    if(getJobCardCompleted["plant"]!= null && getJobCardCompleted["plant"]!=undefined){
      xml = xml.replace("Plant",getJobCardCompleted["plant"]);
      if(getJobCardCompleted["date"]!= null && getJobCardCompleted["date"]!=undefined){
        xml = xml.replace("Date",getJobCardCompleted["date"]);
        if(getJobCardCompleted["material"]!= null && getJobCardCompleted["material"]!=undefined){
          xml = xml.replace("MaterialNumber",getJobCardCompleted["material"]);
          if(getJobCardCompleted["jobCard"]!= null && getJobCardCompleted["jobCard"]!=undefined){
            xml = xml.replace("JobCardNo",getJobCardCompleted["jobCard"]);
            if(getJobCardCompleted["uniqueNumber"]!= null && getJobCardCompleted["uniqueNumber"]!=undefined){
              xml = xml.replace("UniqueNumber",getJobCardCompleted["uniqueNumber"]);
              if(getJobCardCompleted["quantity"]!= null && getJobCardCompleted["quantity"]!=undefined){
                xml = xml.replace("ComponentquantityComponent",getJobCardCompleted["quantity"]);
                console.log("Line 252",xml);
                // sails.log.info(" \n XML: ",xml);
                xmlhttp.send(xml);
              }
            }
          }
        }
      }
    }
  }
}

async function newSapTransactionEntry(newDateTimeNow){
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open('POST', 'http://TDCSAPDAPPPRD.blr.telco.co.in:8001/sap/bc/srt/rfc/sap/zmppp_ws_comp_dtls/570/zmppp_ws_comp_dtls/zmppp_ws_comp_dtls', true,"TMML_BRIOT","tml!06TML");
  xmlhttp.onreadystatechange = async function() {
    if (xmlhttp.readyState == 4) {
      var xml = xmlhttp.responseText;
      var result = convert.xml2json(xml, {compact: true, spaces: 4});
      var newJSON = JSON.parse(result);
      console.log("Line 57",newJSON["_attributes"]);
      var resultData = newJSON["soap-env:Envelope"]["soap-env:Body"]["n0:ZMPPP_COMP_DTL_WEBSERVICEResponse"]["ZCOMP_DTL"]["item"];

      for(var i =1;i<resultData.length;i++){
        sails.log.info("NEW part DATA received from SAP: ",resultData.length);

        if(resultData[i]["ZSTATUS"]["_text"] == "N"){
          var newPartNumber = await PartNumber.find({
            partNumber : resultData[i]["ZIDNRK"]["_text"]
          });
          console.log("Line 72",newPartNumber);
          if(newPartNumber[0] != undefined && newPartNumber[0] != null){
            var newRawMaterialIdUpdated;
            if(resultData[i]["ZMATNR"]["_text"]){
              var newRawMaterial = await RawMaterial.find({
                rawMaterialNumber : resultData[i]["ZMATNR"]["_text"]
              })
              if(newRawMaterial[0] != null && newRawMaterial[0] != undefined){
                newRawMaterialIdUpdated = newRawMaterial[0]["id"];
                var newRawMaterial = await RawMaterial.update({
                  rawMaterialNumber : resultData[i]["ZMATNR"]["_text"]
                }).set({
                  description: resultData[i]["ZMAKTX1"]["_text"],
                });
              }
              else{
                var newRawMaterialId = await RawMaterial.create({
                  rawMaterialNumber: resultData[i]["ZMATNR"]["_text"],
                  description: resultData[i]["ZMAKTX1"]["_text"],
                  uom: resultData[i]["ZMEINS"]["_text"],
                  remarks: "",
                  status:1,
                  materialTypeId:1
                })
                .fetch();
                newRawMaterialIdUpdated = newRawMaterialId["id"];
              }
            }
            else if(!resultData[i]["ZMATNR"]["_text"]){
              var newRawMaterial = await RawMaterial.find({
                rawMaterialNumber : 'N/A',
                description:'Description N/A in SAP'
              })
              if(newRawMaterial[0] != null && newRawMaterial[0] != undefined){
                newRawMaterialIdUpdated = newRawMaterial[0]["id"];
              }
            }
            var newLocationId;
            var newLocation = await Location.find({
              name:resultData[i]["ZLGFSB"]["_text"]
            });
            if(newLocation[0] != null && newLocation[0] != undefined){
              console.log(newLocation);
              newLocationId = newLocation[0]["id"]
            }
            else {
              await Location.create({
                name:resultData[i]["ZLGFSB"]["_text"],
                barcodeSerial:Date.now(),
                locationType:'Kanban Location'
              });
              var newLocation1 = await Location.find({
                name:resultData[i]["ZLGFSB"]["_text"]
              });
              newLocationId = newLocation1[0]["id"]
            }
            let rackLoc = "";
            if(resultData[i]["ZRACKLOC"]["_text"]){
              rackLoc = resultData[i]["ZRACKLOC"]["_text"]
            }
            let prodLoc = "";
            if(resultData[i]["ZLGPRO"]["_text"]){
              prodLoc = resultData[i]["ZLGPRO"]["_text"]
            }
            // console.log("newRawMaterialIdUpdated",newRawMaterialIdUpdated);
            var partNumber = await PartNumber.update({
              partNumber:resultData[i]["ZIDNRK"]["_text"]
            })
            .set({
              description:resultData[i]["ZMAKTX"]["_text"],
              partCreationDate:resultData[i]["ZANDAT1"]["_text"],
              partChangeDate:resultData[i]["ZAEDAT"]["_text"],
              partStatus:resultData[i]["ZSTATUS"]["_text"],
              uom:resultData[i]["ZMEINS"]["_text"],
              materialGroup:resultData[i]["ZMATKL"]["_text"],
              rawMaterialId:newRawMaterialIdUpdated,
              kanbanLocation : newLocationId,
              rackLoc :rackLoc,
              prodLoc :prodLoc
            });
            sails.log.info("Updated Data By SAP",partNumber);
          }
          else{
            console.log("Line 67", resultData[i]["ZMATNR"]["_text"]);
            console.log("Part Number is :-", resultData[i]["ZIDNRK"]);
            var newRawMaterial;
            if(resultData[i]["ZMATNR"]["_text"]){
              newRawMaterial = await RawMaterial.find({
                rawMaterialNumber : resultData[i]["ZMATNR"]["_text"]
              });
            }
            // console.log(newRawMaterial[0]);
            if(newRawMaterial[0]){
              console.log("Part Number is :-", resultData[i]["ZIDNRK"]);
              var newLocationId;
              var newLocation = await Location.find({
                name:resultData[i]["ZLGFSB"]["_text"]
              });
              if(newLocation[0] != null && newLocation[0] != undefined){
                console.log(newLocation);
                newLocationId = newLocation[0]["id"]
              }
              else {
                await Location.create({
                  name:resultData[i]["ZLGFSB"]["_text"],
                  barcodeSerial:Date.now(),
                  locationType:'Kanban Location'
                });
                var newLocation1 = await Location.find({
                  name:resultData[i]["ZLGFSB"]["_text"]
                });
                newLocationId = newLocation1[0]["id"]
              }
              var newPartNumber1 = await PartNumber.create({
                partNumber:resultData[i]["ZIDNRK"]["_text"],
                description:resultData[i]["ZMAKTX"]["_text"],
                partCreationDate:resultData[i]["ZANDAT1"]["_text"],
                partChangeDate:resultData[i]["ZAEDAT"]["_text"],
                partStatus:resultData[i]["ZSTATUS"]["_text"],
                uom:resultData[i]["ZMEINS"]["_text"],
                materialGroup:resultData[i]["ZMATKL"]["_text"],
                rawMaterialId : newRawMaterial[0]["id"],
                status : 1,
                jcCreateStatus:1,
                rackLoc :resultData[i]["ZRACKLOC"]["_text"],
                prodLoc :resultData[i]["ZLGPRO"]["_text"],
                kanbanLocation : newLocationId
              })
              .fetch();
              console.log("newPartNumber", newPartNumber1[0]);
              if(newPartNumber1){
                var selfSignedConfig = {
                  host: '128.9.24.24',
                  port: 25
                };
                var transporter = nodemailer.createTransport(selfSignedConfig);
                var mailText = "New Part Added into Software by SAP, Please upload process sequence for the same. ";
                mailText = mailText + "\n Part Number: " + newPartNumber1["partNumber"];
                mailText = mailText + "\n Part Description: " + newPartNumber1["description"];
                var mailOptions = {
               from: "MachineShop_WIP@tatamarcopolo.com", // sender address (who sends)
               to:"santosh.adaki@tatamarcopolo.com;ashishm@tatamotors.com;santosh.arishinakar@tatamarcopolo.com",
               subject: "NEW part added by SAP", // Subject line
               text: mailText,
             };
             transporter.sendMail(mailOptions, function(error, info) {
               if(error){
                 sails.log.error("New parts Added mail not sent",error);
               } else {
                 sails.log.info('New parts Added Message sent: ' + info.response);
               }
             });
           }
           sails.log.info("NEW part added by SAP: ",newPartNumber1[0]);
              // break;
            }
            else{
              var newRawMaterialIdUpdated;
              if(!resultData[i]["ZMATNR"]["_text"]){
                var newRawMaterial = await RawMaterial.find({
                  rawMaterialNumber : 'N/A',
                  description:'Description N/A in SAP'
                })
                if(newRawMaterial[0] != null && newRawMaterial[0] != undefined){
                  newRawMaterialIdUpdated = newRawMaterial[0]["id"];
                }
              }
              else{
                var newRawMaterialId = await RawMaterial.create({
                  rawMaterialNumber: resultData[i]["ZMATNR"]["_text"],
                  description: resultData[i]["ZMAKTX1"]["_text"],
                  uom: resultData[i]["ZMEINS"]["_text"],
                  remarks: "",
                  status:1,
                  materialTypeId:1
                })
                .fetch();
                console.log("Part Number is :-", resultData[i]["ZIDNRK"]);

                newRawMaterialIdUpdated = newRawMaterialId["id"];
              }
              var newLocationId;
              var newLocation = await Location.find({
                name:resultData[i]["ZLGFSB"]["_text"]
              });
              if(newLocation[0] != null && newLocation[0] != undefined){
                console.log(newLocation);
                newLocationId = newLocation[0]["id"]
              }
              else {
                await Location.create({
                  name:resultData[i]["ZLGFSB"]["_text"],
                  barcodeSerial:Date.now(),
                  locationType:'Kanban Location'
                });
                var newLocation1 = await Location.find({
                  name:resultData[i]["ZLGFSB"]["_text"]
                });
                newLocationId = newLocation1[0]["id"]
              }
              var newPartNumber1 = await PartNumber.create({
                partNumber:resultData[i]["ZIDNRK"]["_text"],
                description:resultData[i]["ZMAKTX"]["_text"],
                partCreationDate:resultData[i]["ZANDAT1"]["_text"],
                partChangeDate:resultData[i]["ZAEDAT"]["_text"],
                partStatus:resultData[i]["ZSTATUS"]["_text"],
                uom:resultData[i]["ZMEINS"]["_text"],
                materialGroup:resultData[i]["ZMATKL"]["_text"],
                rawMaterialId :newRawMaterialId ,
                status : 1,
                jcCreateStatus:1,
                rackLoc :resultData[i]["ZRACKLOC"]["_text"],
                prodLoc :resultData[i]["ZLGPRO"]["_text"],
                kanbanLocation : newLocationId
              })
              .fetch();
              console.log("newPartNumber", newPartNumber1[0]);
              if(newPartNumber1){
                var selfSignedConfig = {
                  host: '128.9.24.24',
                  port: 25
                };
                var transporter = nodemailer.createTransport(selfSignedConfig);
                var mailText = "New Part Added into Software by SAP, Please upload process sequence for the same. ";
                mailText = mailText + "\n Part Number: " + newPartNumber1["partNumber"];
                mailText = mailText + "\n Part Description: " + newPartNumber1["description"];
                var mailOptions = {
               from: "MachineShop_WIP@tatamarcopolo.com", // sender address (who sends)
               to:"santosh.adaki@tatamarcopolo.com;ashishm@tatamotors.com;santosh.arishinakar@tatamarcopolo.com",
               subject: "NEW part added by SAP", // Subject line
               text: mailText,
             };
             transporter.sendMail(mailOptions, function(error, info) {
               if(error){
                 sails.log.error("NewParts-Added mail not sent",error);
               } else {
                 sails.log.info('NewParts-Added Message sent: ' + info.response);
               }
             });
           }
           sails.log.info("NEW part added by SAP: ",newPartNumber1[0]);
         }
       }
     }
     else if(resultData[i]["ZSTATUS"]["_text"] == "C"){
       var newRawMaterialIdUpdated;
       if(resultData[i]["ZMATNR"]["_text"]){
         var newRawMaterial = await RawMaterial.find({
           rawMaterialNumber : resultData[i]["ZMATNR"]["_text"]
         })
         if(newRawMaterial[0] != null && newRawMaterial[0] != undefined){
           newRawMaterialIdUpdated = newRawMaterial[0]["id"];
           var newRawMaterial = await RawMaterial.update({
             rawMaterialNumber : resultData[i]["ZMATNR"]["_text"]
           }).set({
             description: resultData[i]["ZMAKTX1"]["_text"],
           });
         }
         else{
           var newRawMaterialId = await RawMaterial.create({
             rawMaterialNumber: resultData[i]["ZMATNR"]["_text"],
             description: resultData[i]["ZMAKTX1"]["_text"],
             uom: resultData[i]["ZMEINS"]["_text"],
             remarks: "",
             status:1,
             materialTypeId:1
           })
           .fetch();
           newRawMaterialIdUpdated = newRawMaterialId["id"];
         }
       }
       else if(!resultData[i]["ZMATNR"]["_text"]){
         var newRawMaterial = await RawMaterial.find({
           rawMaterialNumber : 'N/A',
           description:'Description N/A in SAP'
         })
         if(newRawMaterial[0] != null && newRawMaterial[0] != undefined){
           newRawMaterialIdUpdated = newRawMaterial[0]["id"];
         }
       }
       var newLocationId;
       var newLocation = await Location.find({
         name:resultData[i]["ZLGFSB"]["_text"]
       });
       if(newLocation[0] != null && newLocation[0] != undefined){
         console.log(newLocation);
         newLocationId = newLocation[0]["id"]
       }
       else {
         await Location.create({
           name:resultData[i]["ZLGFSB"]["_text"],
           barcodeSerial:Date.now(),
           locationType:'Kanban Location'
         });
         var newLocation1 = await Location.find({
           name:resultData[i]["ZLGFSB"]["_text"]
         });
         newLocationId = newLocation1[0]["id"]
       }
       let rackLoc = "";
       if(resultData[i]["ZRACKLOC"]["_text"]){
         rackLoc = resultData[i]["ZRACKLOC"]["_text"]
       }
       let prodLoc = "";
       if(resultData[i]["ZLGPRO"]["_text"]){
         prodLoc = resultData[i]["ZLGPRO"]["_text"]
       }
       var partNumber =await PartNumber.update({
         partNumber:resultData[i]["ZIDNRK"]["_text"]
       })
       .set({
         description:resultData[i]["ZMAKTX"]["_text"],
         partCreationDate:resultData[i]["ZANDAT1"]["_text"],
         partChangeDate:resultData[i]["ZAEDAT"]["_text"],
         partStatus:resultData[i]["ZSTATUS"]["_text"],
         uom:resultData[i]["ZMEINS"]["_text"],
         materialGroup:resultData[i]["ZMATKL"]["_text"],
         rawMaterialId:newRawMaterialIdUpdated,
         kanbanLocation : newLocationId,
         rackLoc :rackLoc,
         prodLoc :prodLoc
       });
       sails.log.info("Updated Data By SAP",partNumber);
       sails.log.info("Part Updated by SAP: ",resultData[i]["ZIDNRK"]["_text"]);
     }
     else if(resultData[i]["ZSTATUS"]["_text"] == "B"){
       var partNumber =await PartNumber.update({
         partNumber:resultData[i]["ZIDNRK"]["_text"]
       })
       .set({
         partStatus:resultData[i]["ZSTATUS"]["_text"],
         status:0
       });
       sails.log.info("Updated Data By SAP Blocked",partNumber);
     }
   }
      // res.send();
    }
  };
  xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
  var xml = fs.readFileSync('D:\\TMML\\BRiOT-TMML-Machine-Shop-Solution\\server\\v1.0.7\\api\\test\\xmlTextFile.xml', 'utf-8');
  xml = xml.replace("newDateNowAPI", newDateTimeNow);
  xml = xml.replace("toDateNowAPI", "");
  console.log(xml);
  sails.log.info("NEW part",xml);
  xmlhttp.send(xml);
}
