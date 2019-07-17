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

    var newDate = new Date();
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
          var partNumber = PartNumber.create({
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
  }
};

