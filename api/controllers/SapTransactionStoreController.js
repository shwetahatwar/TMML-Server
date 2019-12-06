/**
 * SapTransactionStoreController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 var fs  = require('fs');
 var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// var xmlParser = require("xml2json");
var convert = require('xml-js');

module.exports = {
  sap315:async function(req,res){
    console.log("Line 14");
    const xmlhttp = new XMLHttpRequest();
    // xmlhttp.open('POST', 'http://eccauto.pune.telco.co.in:8000/sap/bc/srt/rfc/sap/zmppp_315_automation_web/170/zmppp_315_automation_web1/zmppp_315_automation_web1', true,"TMML_BRIOT","tml!07TML");
    xmlhttp.open('POST', 'http://TDCSAPDAPPPRD.blr.telco.co.in:8001/sap/bc/srt/rfc/sap/zmppp_315_automation_web/570/zmppp_315_automation_web/zmppp_315_automation_web', true,"TMML_BRIOT","tml!06TML");
    xmlhttp.onreadystatechange = async function() {
      if (xmlhttp.readyState == 4) {
        var xml = xmlhttp.responseText;
        var result = convert.xml2json(xml, {compact: true, spaces: 4});
        var newJSON = JSON.parse(result);
        console.log("Line 214", newJSON["soap-env:Envelope"]["soap-env:Body"]["n0:Zmppp315AutomationWebResponse"]["Z_315Output"]["item"][1]);
        var resultData = newJSON["soap-env:Envelope"]["soap-env:Body"]["n0:Zmppp315AutomationWebResponse"]["Z_315Output"]["item"][1];
        console.log("Line 25",resultData["Zmblnr1"]);

        if(resultData["Zmblnr1"]["_text"] != null && resultData["Zmblnr1"]["_text"] != undefined && resultData["Zmblnr"]["_text"] != 0){
          // var sapTransaction = await SapTransaction.update({
          //   uniqueNumber:resultData["Zbktxt"]["_text"]
          // })
          // .set({
          //   documentNumber:resultData["Zmblnr"]["_text"],
          //   documentYear:resultData["Zmjahr"]["_text"],
          //   remarks:resultData["Zremarks"]["_text"]
          // });
          var sapTransactionStoreEntry = await SapTransactionStore.create({
            documentNumber313:resultData["Zmblnr"]["_text"],
            documentYear313:resultData["Zmjahr"]["_text"],
            jobCard:resultData["Zxblnr"]["_text"],
            uniqueNumber:resultData["Zbktxt"]["_text"],
            quantity313:resultData["Zqty313"]["_text"],
            documentNumber315:resultData["Zmblnr1"]["_text"],
            documentYear315:resultData["Zmjahr1"]["_text"],
            quantity315:resultData["Zqty"]["_text"],
            remarks:resultData["Zremarks"]["_text"]
          }).fetch();
          res.send(sapTransactionStoreEntry);
          var getJobCard = await JobCard.find({
            barcodeSerial:resultData["Zxblnr"]["_text"]
          });
          if(getJobCard[0]!=null && getJobCard[0]!=undefined){
            var jobLocationRelationId = await Joblocationrelation.update({
              jobcardId:getJobCard[0]["id"]
            })
            .set({
              processStatus:"Final Location"
            });
          }
        }
        else{
          res.status(424);
          res.send(resultData["Zremarks"]["_text"]);
          sails.log.error("315 not updated",resultData["Zremarks"]["_text"]);
          // res.send("Not updated");
        }
      }
    };

    var getJobCardCompleted = await SapTransaction.find({
      jobCard:req.body.jobCard
    });
    console.log(getJobCardCompleted);
    var getJobCard = await JobCard.find({
      barcodeSerial:req.body.jobCard
    });
    if(getJobCard[0]["jobcardStatus"] !="Completed"){
      res.status(424);
      res.send("Job Card is not completed");
    }
    else{
      if(getJobCardCompleted[0] != null && getJobCardCompleted[0] != undefined){
        xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
        var xml = fs.readFileSync('D:\\TMML\\BRiOT-TMML-Machine-Shop-Solution\\server\\v1.0.7\\api\\test\\sap315.xml', 'utf-8');
        if(getJobCardCompleted[0]["documentNumber"]!= null && getJobCardCompleted[0]["documentNumber"]!=undefined){
          xml = xml.replace("documentNumber",getJobCardCompleted[0]["documentNumber"]);
          xml = xml.replace("documentYear",getJobCardCompleted[0]["documentYear"]);
          xml = xml.replace("jobCardNumber",getJobCardCompleted[0]["jobCard"]);
          xml = xml.replace("uniqueNumber",getJobCardCompleted[0]["uniqueNumber"]);
          xml = xml.replace("quantityEntered",getJobCardCompleted[0]["quantity"]);
          console.log(xml);
          xmlhttp.send(xml);
        }
      }
    }
  },

  soapRequestPost1:async function(req,res){
    var getJobCardCompleted = await TestSAPTransaction.find({
      documentNumber: 0
    });
    if(getJobCardCompleted[0] != null && getJobCardCompleted[0] != undefined){
      for(var i=0; i < getJobCardCompleted.length; i++){
        if(getJobCardCompleted[i] != null && getJobCardCompleted[i] != undefined){
          await satTransactionEntry1(getJobCardCompleted[i])
        }
      }
    }
    res.send();
  },
};

async function satTransactionEntry1(getJobCardCompleted){

  const xmlhttp = new XMLHttpRequest();
  // xmlhttp.open('POST', 'http://eccauto.pune.telco.co.in:8000/sap/bc/srt/rfc/sap/zmp_web_prod_booking/170/zmp_web_prod_booking/zmp_web_prod_booking', true,"TMML_BRIOT","tml!06TML");
  xmlhttp.open('POST', 'http://eccauto.pune.telco.co.in:8000/sap/bc/srt/rfc/sap/zmp_web_prod_booking/170/zmp_web_prod_booking/zmp_web_prod_booking', true,"TMML_BRIOT","tml!07TML");
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
          var sapTransaction = await TestSAPTransaction.update({
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
        var sapTransaction = await TestSAPTransaction.update({
          uniqueNumber:resultData["Zbktxt"]["_text"]
        })
        .set({
          documentNumber:1,
          documentYear:resultData["Zmjahr"]["_text"],
          remarks:resultData["Zremarks"]["_text"]
        });
      }
      else{
        var sapTransaction = await TestSAPTransaction.update({
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
