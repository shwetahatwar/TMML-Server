var XLSX = require('xlsx'),
    xls_utils = XLSX.utils;

var nodemailer = require ('nodemailer');

module.exports={

	test : async function(req,res){
		
	  const mediaFile = req.file('media')
	  if (!mediaFile._files[0]) {
	      sails.log.warn('No file uploaded')
	      clearTimeout(mediaFile.timeouts.untilMaxBufferTimer)
	      clearTimeout(mediaFile.timeouts.untilFirstFileTimer)
	      return res.send('no file given!')
	  }

	  req.file('media').upload({
	    dirname: 'C:\\All Projects\\TMML\\New Server\\server\\uploads',
	    filename:'new'
	  },async function whenDone(err, uploadedFiles) {
	    if (err) {
	      sails.log.error('Error uploading file', err)
	    }
	    console.log(uploadedFiles[0].fd);

	    var workbook = XLSX.readFile(uploadedFiles[0].fd);
			var sheet = workbook.Sheets[workbook.SheetNames[0]];
			var num_rows = xls_utils.decode_range(sheet['!ref']).e.r;
			for(var i = 1, l = num_rows; i <= l; i++){
	    	var cell = xls_utils.encode_cell({c:0, r:i});
	    	var value = sheet[cell];
	    	var createdBy = xls_utils.encode_cell({c:1, r:i});
	    	var createdByValue = sheet[createdBy];
	    	var updatedBy = xls_utils.encode_cell({c:2, r:i});
	    	var updatedByValue = sheet[updatedBy];
	    	var createdByIdValues;
	    	var updatedByIdValues;
	    	if(createdByValue!=null&&createdByValue!=undefined)
	    	{
		    	await User.findOne({
		    		where:{'username':createdByValue['v']}
		    	})
		    	.then((createdById)=>{createdByIdValues = createdById["id"]});
		    }
		    if(updatedByValue!=null&&updatedByValue!=undefined)
		    {
		    	await User.findOne({
		    		where:{'username':updatedByValue['v']}
		    	})
		    	.then((updatedById)=>{updatedByIdValues = updatedById["id"]});
		    }
		    // if()
	    	await Cell.create({name:value['v'],createdBy:createdByIdValues,updatedBy:updatedByIdValues});
			}
			return res.ok();
	  })
	},

	testMail:function(req,res){
		var selfSignedConfig = {
      host:'smtp.zoho.com',
      port:465,
      auth: {
        user: 'nikhil.kamble@briot.in', // generated ethereal user
        pass: 'briot@123' // generated ethereal password
      }
    };
    var transporter = nodemailer.createTransport(selfSignedConfig);
    var mailOptions = {
      from: 'nikhil.kamble@briot.in', // sender address (who sends)
      to: 'nikhil.kamble@briot.in, sagar@briot.in, dinesh@briot.in, karan@briot.in, servicedesk@briot.in', // list of receivers (who receives)
      subject: 'Test Mail SMTP', // Subject line
      text: 'This is a test mail for TMML SMTP'
    };
    transporter.sendMail(mailOptions, function(error, info) {
      if(error){
             return console.log(error);
      } else {
             console.log('Message sent: ' + info.response);
      }
    });
    res.send();
	}
};