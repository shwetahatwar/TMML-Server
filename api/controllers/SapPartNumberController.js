/**
 * SapPartNumberControllerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var fs  = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var parseString = require('xml2js').parseString;

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

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://eccauto.pune.telco.co.in:8000/sap/bc/srt/rfc/sap/zmppp_ws_comp_dtl/170/zmppp_ws_comp_dtl/zmppp_ws_comp_dtl', true);
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
        // alert(xmlhttp.responseText);
        console.log(xmlhttp.responseText);
        var xml = xmlhttp.responseText;
        var xmlResult;
        parseString(xml, function (err, result) {
          console.dir(JSON.stringify(result));
          xmlResult = JSON.stringify(result);
        });

        var xmlItems = xmlResult["ZCOMP_DTL"];

        for(var i =0;i<xmlItems.length;i++){

          if(xmlItems[i]["item"]["ZSTATUS"] == "N"){
            var partNumber = PartNumber.find({
              partNumber:xmlItems[i]["item"]["ZIDNRK"],
            });
            if(partNumber[0]!=null && partNumber[0]!=undefined){

            }
            else{
              var newPartNumber = PartNumber.create({
                partNumber:xmlItems[i]["item"]["ZIDNRK"],
                description:xmlItems[i]["item"]["ZMAKTX"],
                partCreationDate:xmlItems[i]["item"]["ZANDAT1"],
                partChangeDate:xmlItems[i]["item"]["ZAEDAT"],
                partStatus:xmlItems[i]["item"]["ZSTATUS"],
                uom:xmlItems[i]["item"]["ZLGFSB"],
                materialGroup:xmlItems[i]["item"]["ZMAKTX1"]
              });
            }
          }
          else if(xmlItems[i]["item"]["ZSTATUS"] == "C"){
            var partNumber = PartNumber.update({
              partNumber:xmlItems[i]["item"]["ZIDNRK"]
            })
            .set({
              description:xmlItems[i]["item"]["ZMAKTX"],
              partCreationDate:xmlItems[i]["item"]["ZANDAT1"],
              partChangeDate:xmlItems[i]["item"]["ZAEDAT"],
              partStatus:xmlItems[i]["item"]["ZSTATUS"],
              uom:xmlItems[i]["item"]["ZLGFSB"],
              materialGroup:xmlItems[i]["item"]["ZMAKTX1"]
            });
          }
          else if(xmlItems[i]["item"]["ZSTATUS"] == "B"){
            var partNumber = PartNumber.update({
              partNumber:xmlItems[i]["item"]["ZIDNRK"]
            })
            .set({
              partStatus:xmlItems[i]["item"]["ZSTATUS"],
              status:0
            });
          }
        }
      }
    };
    // xmlhttp.setRequestHeader('SOAPAction', '');
    xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
    const xml = fs.readFileSync('C:\\All Projects\\TMML\\server\\server\\api\\test\\xmlTextFile.xml', 'utf-8');
    xmlhttp.send(xml);
  },

  soapRequest1:async function(req,res){
    var xml = '<?xml version="1.0" encoding="UTF-8" ?><business><company>Code Blog</company><owner>Nic Raboy</owner><employee><firstname>Nic</firstname><lastname>Raboy</lastname></employee><employee><firstname>Maria</firstname><lastname>Campos</lastname></employee></business>';
    parseString(xml, function (err, result) {
      console.dir(JSON.stringify(result));
    });
  },

  soapRequestPost:async function(req,res){
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://eccauto.pune.telco.co.in:8000/sap/bc/srt/wsdl/bndg_5D15DB2018714700E100802BAC181DB2/wsdl11/allinone/ws_policy/document?sap-client=170', true);
    xmlhttp.onreadystatechange = async function() {
      if (xmlhttp.readyState == 4) {
        // alert(xmlhttp.responseText);
        console.log(xmlhttp.responseText);
        var xml = xmlhttp.responseText;
        var xmlResult;
        parseString(xml, function (err, result) {
          console.dir(JSON.stringify(result));
          xmlResult = JSON.stringify(result);
        });

        var xmlItems = xmlResult["ZwebOutput"];

        for(var i =0;i<xmlItems.length;i++){
          var sapTransaction = await SapTransaction.update({
            uniqueNumber:xmlItems[i]["item"]["ZBKTXT"]
          })
          .set({
            documentNumber:xmlItems[i]["item"]["ZMBLNR"],
            documentYear:xmlItems[i]["item"]["ZMJAHR"],
            remarks:xmlItems[i]["item"]["ZREMARKS"]
          });
        }
      }
    };
    // xmlhttp.setRequestHeader('SOAPAction', '');
    xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
    const xml = fs.readFileSync('C:\\All Projects\\TMML\\server\\server\\api\\test\\xmlPOSTTextFile.xml', 'utf-8');
    var getJobCardCompleted = SapTransaction.find({
      documentNumber: 0
    });
    for(var i=0;i<getJobCardCompleted.length;i++){
      xml = xml.replace("Plant",getJobCardCompleted[i]["plant"]);
      xml = xml.replace("Date",getJobCardCompleted[i]["date"]);
      xml = xml.replace("MaterialNumber",getJobCardCompleted[i]["material"]);
      xml = xml.replace("JobCardNo",getJobCardCompleted[i]["jobCard"]);
      xml = xml.replace("UniqueNumber",getJobCardCompleted[i]["uniqueNumber"]);
      xml = xml.replace("ComponentquantityComponent",getJobCardCompleted[i]["quantity"]);
      xmlhttp.send(xml);
    }
    
  }
};

