/**
 * SapPartNumberControllerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
	create : async function(req,res){
		// const soapRequest = require('easy-soap-request');
		// const url = 'http://eccauto.pune.telco.co.in:8000/sap/bc/srt/rfc/sap/zmp_mc_comp_details/170/zmp_mc_comp_details/zmp_mc_comp_details';
		// const headers = {
		//   'user-agent': 'sampleTest',
		//   'Content-Type': 'application/xml',
		// 	'auth' = "Basic " + new Buffer("TMML_BRIOT" + ":" + "tml!06TML").toString("base64");
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

		var soap = require('soap');
		var url = 'http://eccauto.pune.telco.co.in:8000/sap/bc/srt/rfc/sap/zmp_mc_comp_details/170/zmp_mc_comp_details/zmp_mc_comp_details';  // Download this file and xsd files from cucm admin page
		var auth = "Basic " + new Buffer("TMML_BRIOT" + ":" + "tml!06TML").toString("base64");
		soap.createClient(url,function(err,client){
		  client.addHttpHeader('Authorization',auth);
		});
	}

};

