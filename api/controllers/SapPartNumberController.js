/**
 * SapPartNumberControllerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var fs  = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// var xmlParser = require("xml2json");
var convert = require('xml-js');

module.exports = {

  create : async function(req,res){

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
            uniqueNumber:resultData["Zbktxt"]["_text"]
          })
          .set({
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
    var sap315 = await SapTransaction.find({
      jobCard: req.body.jobCard
    });
    res.send(sap315);
  }
};

async function satTransactionEntry(getJobCardCompleted){

  const xmlhttp = new XMLHttpRequest();
  // xmlhttp.open('POST', 'http://eccauto.pune.telco.co.in:8000/sap/bc/srt/rfc/sap/zmp_web_prod_booking/170/zmp_web_prod_booking/zmp_web_prod_booking', true,"TMML_BRIOT","tml!06TML");
  xmlhttp.open('POST', 'http://TDCSAPDAPPPRD.blr.telco.co.in:8001/sap/bc/srt/rfc/sap/zmp_web_prod_booking/570/zmp_web_prod_booking/zmp_web_prod_booking', true,"TMML_BRIOT","tml!06TML");
  xmlhttp.onreadystatechange = async function() {
    if (xmlhttp.readyState == 4) {
      var xml = xmlhttp.responseText;
      var result = convert.xml2json(xml, {compact: true, spaces: 4});
      var newJSON = JSON.parse(result);
      console.log("Line 214", newJSON["soap-env:Envelope"]["soap-env:Body"]["n0:ZmpppProdBookingWebResponse"]["ZwebOutput"]["item"][1]);
      var resultData = newJSON["soap-env:Envelope"]["soap-env:Body"]["n0:ZmpppProdBookingWebResponse"]["ZwebOutput"]["item"][1];
      // var xmlItems = newJSON["ZwebOutput"];
      console.log(resultData);

      if(resultData["Zmblnr"]["_text"] != null && resultData["Zmblnr"]["_text"] != undefined && resultData["Zmblnr"]["_text"] != 0){
        // for(var i =0;i<xmlItems.length;i++){
          var sapTransaction = await SapTransaction.update({
            uniqueNumber:resultData["Zbktxt"]["_text"]
          })
          .set({
            documentNumber:resultData["Zmblnr"]["_text"],
            documentYear:resultData["Zmjahr"]["_text"],
            remarks:resultData["Zremarks"]["_text"]
          });
        // }
      }
      else if(resultData["Zremarks"]["_text"] == "Unique Number and Job Card already exists"){
        var sapTransaction = await SapTransaction.update({
          uniqueNumber:resultData["Zbktxt"]["_text"]
        })
        .set({
          documentNumber:1,
          documentYear:resultData["Zmjahr"]["_text"],
          remarks:resultData["Zremarks"]["_text"]
        });
      }
      else{
        var sapTransaction = await SapTransaction.update({
          uniqueNumber:resultData["Zbktxt"]["_text"]
        })
        .set({
          documentNumber:0,
          documentYear:resultData["Zmjahr"]["_text"],
          remarks:resultData["Zremarks"]["_text"]
        });
      }
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
  xmlhttp.open('POST', 'http://fjqaqts.pune.telco.co.in:8000/sap/bc/srt/rfc/sap/zmppp_ws_comp_dtls/570/zmppp_ws_comp_dtls/zmppp_ws_comp_dtls', true,"TMML_BRIOT","tml!06TML");
  xmlhttp.onreadystatechange = async function() {
    if (xmlhttp.readyState == 4) {
      var xml = xmlhttp.responseText;
      var result = convert.xml2json(xml, {compact: true, spaces: 4});
      var newJSON = JSON.parse(result);
      console.log("Line 57",newJSON["_attributes"]);
      var resultData = newJSON["soap-env:Envelope"]["soap-env:Body"]["n0:ZMPPP_COMP_DTL_WEBSERVICEResponse"]["ZCOMP_DTL"]["item"];

      for(var i =1;i<resultData.length;i++){

        if(resultData[i]["ZSTATUS"]["_text"] == "N"){
          var newPartNumber = await PartNumber.find({
            partNumber : resultData[i]["ZIDNRK"]["_text"]
          });
          console.log("Line 72",newPartNumber);
          if(newPartNumber[0] != undefined && newPartNumber[0] != null){
          }
          else{
            console.log("Line 67", resultData[i]["ZMATNR"]["_text"]);
            console.log("Part Number is :-", resultData[i]["ZIDNRK"]);
            var newRawMaterial = await RawMaterial.find({
              rawMaterialNumber : resultData[i]["ZMATNR"]["_text"]
            });
            console.log(newRawMaterial[0]);
            if(newRawMaterial[0] != undefined && newRawMaterial[0] !=null){
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
                kanbanLocation : newLocationId
              })
              .fetch();
              console.log("newPartNumber", newPartNumber1[0]);
              // break;
            }
            else{
              var newRawMaterialId = await RawMaterial.create({
                rawMaterialNumber: resultData[i]["ZMATNR"]["_text"],
                description: "",
                uom: resultData[i]["ZMEINS"]["_text"],
                remarks: "",
                status:1
              })
              .fetch();
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
                rawMaterialId : newRawMaterialId["id"],
                status : 1,
                kanbanLocation : newLocationId
              })
              .fetch();
              console.log("newPartNumber", newPartNumber1[0]);
            }
          }
        }
        else if(resultData[i]["ZSTATUS"] == "C"){
          var partNumber = PartNumber.update({
            partNumber:resultData[i]["ZIDNRK"]["_text"]
          })
          .set({
            description:resultData[i]["ZMAKTX"]["_text"],
            partCreationDate:resultData[i]["ZANDAT1"]["_text"],
            partChangeDate:resultData[i]["ZAEDAT"]["_text"],
            partStatus:resultData[i]["ZSTATUS"]["_text"],
            uom:resultData[i]["ZMEINS"]["_text"],
            materialGroup:resultData[i]["ZMATKL"]["_text"],
          });
        }
        else if(resultData[i]["ZSTATUS"] == "B"){
          var partNumber = PartNumber.update({
            partNumber:resultData[i]["ZIDNRK"]["_text"]
          })
          .set({
            partStatus:resultData[i]["ZSTATUS"]["_text"],
            status:0
          });
        }
      }
      // res.send();
    }
  };
  xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
  var xml = fs.readFileSync('D:\\TMML\\BRiOT-TMML-Machine-Shop-Solution\\server\\v1.0.7\\api\\test\\xmlTextFile.xml', 'utf-8');
  xml = xml.replace("newDateNowAPI", newDateTimeNow);
  console.log(xml);
  xmlhttp.send(xml);
}
