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
    // const soapRequest = require('easy-soap-request');
    // const url = 'http://eccauto.pune.telco.co.in:8000/sap/bc/srt/rfc/sap/zmp_mc_comp_details/170/zmp_mc_comp_details/zmp_mc_comp_details';
    // const headers = {
    //   'user-agent': 'sampleTest',
    //   'Content-Type': 'application/xml',
    //  'auth' = "Basic " + new Buffer("TMML_BRIOT" + ":" + "tml!06TML").toString("base64");
    //   // 'soapAction': 'https://graphical.weather.gov/xml/DWMLgen/wsdl/ndfdXML.wsdl#LatLonListZipCode',
    // };
    // var auth = "Basic " + new Buffer("TMML_BRIOT" + ":" + "tml!06TML").toString("base64");
    // const xml = fs.readFileSync('../test/xmlTextFile.xml', 'utf-8');

      // // usage of module
    // (async () => {
    //   const { response } = await soapRequest(url, headers, xml, 1000); // Optional timeout parameter(milliseconds)
    //   const { headers, body, statusCode } = response;
    //   console.log(headers);
    //   console.log(body);
    //   console.log(statusCode);
    // })();

    // var soap = require('soap');
    // var url = 'http://eccauto.pune.telco.co.in:8000/sap/bc/srt/rfc/sap/zmp_mc_comp_details/170/zmp_mc_comp_details/zmp_mc_comp_details';  // Download this file and xsd files from cucm admin page
    // var auth = "Basic " + new Buffer("TMML_BRIOT" + ":" + "tml!06TML").toString("base64");
    // soap.createClient(url,function(err,client){
    //   client.addHttpHeader('Authorization',auth){
    //     console.log(result);
    //   };
    // });
  },

  soapRequestGet:async function(req,res){
    console.log("In");
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://fjqaqts.pune.telco.co.in:8000/sap/bc/srt/rfc/sap/zmppp_ws_comp_dtls/570/zmppp_ws_comp_dtls/zmppp_ws_comp_dtls', true,"TMML_BRIOT","tml!06TML");
    xmlhttp.onreadystatechange = async function() {
      if (xmlhttp.readyState == 4) {
        // alert(xmlhttp.responseText);
        console.log(xmlhttp.responseText);
        var xml = xmlhttp.responseText;
        var result = convert.xml2json(xml, {compact: true, spaces: 4});
        var newJSON = JSON.parse(result);
        console.log("Line 57",newJSON["_attributes"]);
        var resultData = newJSON["soap-env:Envelope"]["soap-env:Body"]["n0:ZMPPP_COMP_DTL_WEBSERVICEResponse"]["ZCOMP_DTL"]["item"];
        // var xmlResult;
        // parseString(xml, function (err, result) {
        //   console.dir(JSON.stringify(result));
        //   xmlResult = JSON.stringify(result);
        // });

        // var xmlItems = resultData["ZCOMP_DTL"];

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

          // res.send();
          // if(resultData[i]["ZSTATUS"] == "N"){
          //   var partNumber = PartNumber.find({
          //     partNumber:resultData[i]["ZIDNRK"],
          //   });
          //   if(partNumber[0]!=null && partNumber[0]!=undefined){
          //
          //   }
          //   else{
          //     var newPartNumber = PartNumber.create({
          //       partNumber:resultData[i]["ZIDNRK"],
          //       description:resultData[i]["ZMAKTX"],
          //       partCreationDate:resultData[i]["ZANDAT1"],
          //       partChangeDate:resultData[i]["ZAEDAT"],
          //       partStatus:resultData[i]["ZSTATUS"],
          //       uom:resultData[i]["ZLGFSB"],
          //       materialGroup:resultData[i]["ZMAKTX1"]
          //     });
          //   }
          // }
          // else if(resultData[i]["ZSTATUS"] == "C"){
          //   var partNumber = PartNumber.update({
          //     partNumber:resultData[i]["ZIDNRK"]
          //   })
          //   .set({
          //     description:resultData[i]["ZMAKTX"],
          //     partCreationDate:resultData[i]["ZANDAT1"],
          //     partChangeDate:resultData[i]["ZAEDAT"],
          //     partStatus:resultData[i]["ZSTATUS"],
          //     uom:resultData[i]["ZLGFSB"],
          //     materialGroup:resultData[i]["ZMAKTX1"]
          //   });
          // }
          // else if(resultData[i]["ZSTATUS"] == "B"){
          //   var partNumber = PartNumber.update({
          //     partNumber:resultData[i]["ZIDNRK"]
          //   })
          //   .set({
          //     partStatus:resultData[i]["ZSTATUS"],
          //     status:0
          //   });
          // }
        }
        res.send();
      }
    };
    // xmlhttp.setRequestHeader('Authorization', );
    xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
    const xml = fs.readFileSync('D:\\TMML\\BRiOT-TMML-Machine-Shop-Solution\\server\\v1.0.7\\api\\test\\xmlTextFile.xml', 'utf-8');
    xmlhttp.send(xml);
  },

  soapRequest1:async function(req,res){
    var xml = '<?xml version="1.0" encoding="UTF-8" ?><business><company>Code Blog</company><owner>Nic Raboy</owner><employee><firstname>Nic</firstname><lastname>Raboy</lastname></employee><employee><firstname>Maria</firstname><lastname>Campos</lastname></employee></business>';
    parseString(xml, function (err, result) {
      console.dir(JSON.stringify(result));
    });
  },

  soapRequestPost:async function(req,res){
    // console.log("In");
    // const xmlhttp = new XMLHttpRequest();
    // // xmlhttp.open('POST', 'http://eccauto.pune.telco.co.in:8000/sap/bc/srt/rfc/sap/zmp_web_prod_booking/170/zmp_web_prod_booking/zmp_web_prod_booking', true,"TMML_BRIOT","tml!06TML");
    // xmlhttp.open('POST', 'http://fjqaqts.pune.telco.co.in:8000/sap/bc/srt/rfc/sap/zmp_web_prod_booking/570/zmp_web_prod_booking/zmp_web_prod_booking', true,"TMML_BRIOT","tml!06TML");
    // xmlhttp.onreadystatechange = async function() {
    //   if (xmlhttp.readyState == 4) {
    //     // alert(xmlhttp.responseText);
    //     // console.log("Line 210",xmlhttp.responseText);
    //     var xml = xmlhttp.responseText;
    //     var result = convert.xml2json(xml, {compact: true, spaces: 4});
    //     var newJSON = JSON.parse(result);
    //     console.log("Line 214", newJSON["soap-env:Envelope"]["soap-env:Body"]["n0:ZmpppProdBookingWebResponse"]["ZwebOutput"]["item"][1]);
    //     var resultData = newJSON["soap-env:Envelope"]["soap-env:Body"]["n0:ZmpppProdBookingWebResponse"]["ZwebOutput"]["item"][1];
    //     // var xmlItems = newJSON["ZwebOutput"];
    //     console.log(resultData);
    //
    //     if(resultData["Zmblnr"]["_text"] != null && resultData["Zmblnr"]["_text"] != undefined && resultData["Zmblnr"]["_text"] != 0){
    //       // for(var i =0;i<xmlItems.length;i++){
    //         var sapTransaction = await SapTransaction.update({
    //           uniqueNumber:resultData["Zbktxt"]["_text"]
    //         })
    //         .set({
    //           documentNumber:resultData["Zmblnr"]["_text"],
    //           documentYear:resultData["Zmjahr"]["_text"],
    //           remarks:resultData["Zremarks"]["_text"]
    //         });
    //       // }
    //     }
    //     else{
    //       var sapTransaction = await SapTransaction.update({
    //         uniqueNumber:resultData["Zbktxt"]["_text"]
    //       })
    //       .set({
    //         documentNumber:1,
    //         documentYear:resultData["Zmjahr"]["_text"],
    //         remarks:resultData["Zremarks"]["_text"]
    //       });
    //     }
    //   }
    // };
    // xmlhttp.setRequestHeader('SOAPAction', '');
    // xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
    // var xml = fs.readFileSync('D:\\TMML\\BRiOT-TMML-Machine-Shop-Solution\\server\\v1.0.7\\api\\test\\xmlPOSTTextFile.xml', 'utf-8');
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
    // if(getJobCardCompleted[0] != null && getJobCardCompleted[0] != undefined){
    //   if(getJobCardCompleted[0]["plant"]!= null && getJobCardCompleted[0]["plant"]!=undefined){
    //     xml = xml.replace("Plant",getJobCardCompleted[0]["plant"]);
    //     if(getJobCardCompleted[0]["date"]!= null && getJobCardCompleted[0]["date"]!=undefined){
    //       xml = xml.replace("Date",getJobCardCompleted[0]["date"]);
    //       if(getJobCardCompleted[0]["material"]!= null && getJobCardCompleted[0]["material"]!=undefined){
    //         xml = xml.replace("MaterialNumber",getJobCardCompleted[0]["material"]);
    //         if(getJobCardCompleted[0]["jobCard"]!= null && getJobCardCompleted[0]["jobCard"]!=undefined){
    //           xml = xml.replace("JobCardNo",getJobCardCompleted[0]["jobCard"]);
    //           if(getJobCardCompleted[0]["uniqueNumber"]!= null && getJobCardCompleted[0]["uniqueNumber"]!=undefined){
    //             xml = xml.replace("UniqueNumber",getJobCardCompleted[0]["uniqueNumber"]);
    //             if(getJobCardCompleted[0]["quantity"]!= null && getJobCardCompleted[0]["quantity"]!=undefined){
    //               xml = xml.replace("ComponentquantityComponent",getJobCardCompleted[0]["quantity"]);
    //               console.log("Line 252",xml);
    //               xmlhttp.send(xml);
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    // res.send();
  },

  parseJson:async function(req,res){
    var xml = fs.readFileSync('D:\\TMML\\BRiOT-TMML-Machine-Shop-Solution\\server\\v1.0.7\\api\\test\\test.xml', 'utf-8');

    // var jsonResult = xmlParser.toJson(xml);
    // var newJSON = JSON.parse(jsonResult);
    // var resultData = newJSON["soap-env:Envelope"]["soap-env:Body"]["n0:ZMPPP_COMP_DTL_WEBSERVICEResponse"]["ZCOMP_DTL"]["item"];
    // console.log("JSON Output", resultData.length);
    // // console.log("JSON Output", newJSON[1]);
    // res.send(resultData[0]);

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

  }
};

async function satTransactionEntry(getJobCardCompleted){

  const xmlhttp = new XMLHttpRequest();
  // xmlhttp.open('POST', 'http://eccauto.pune.telco.co.in:8000/sap/bc/srt/rfc/sap/zmp_web_prod_booking/170/zmp_web_prod_booking/zmp_web_prod_booking', true,"TMML_BRIOT","tml!06TML");
  xmlhttp.open('POST', 'http://fjqaqts.pune.telco.co.in:8000/sap/bc/srt/rfc/sap/zmp_web_prod_booking/570/zmp_web_prod_booking/zmp_web_prod_booking', true,"TMML_BRIOT","tml!06TML");
  xmlhttp.onreadystatechange = async function() {
    if (xmlhttp.readyState == 4) {
      // alert(xmlhttp.responseText);
      // console.log("Line 210",xmlhttp.responseText);
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
  // console.log("Line 389",getJobCardCompleted);
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
