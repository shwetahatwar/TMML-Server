var XLSX = require('xlsx'),
    xls_utils = XLSX.utils;

module.exports={

  upload : async function(req,res){
    var rejectedEmployee = new Array();
    const mediaFile = req.file('media')
    if (!mediaFile._files[0]) {
        sails.log.warn('No file uploaded')
        clearTimeout(mediaFile.timeouts.untilMaxBufferTimer)
        clearTimeout(mediaFile.timeouts.untilFirstFileTimer)
        return res.send('no file given!')
    }
    else{
      req.file('media').upload({
        dirname: 'C:\\All Projects\\TMML\\New Server\\server\\uploads\\Employee',
        filename:'new'
      },async function whenDone(err, uploadedFiles) {
        if (err) {
          sails.log.error('Error uploading file', err)
        }
        var workbook = XLSX.readFile(uploadedFiles[0].fd);
        var sheet = workbook.Sheets[workbook.SheetNames[0]];
        var num_rows = xls_utils.decode_range(sheet['!ref']).e.r;
        for(var i = 1, l = num_rows; i <= l; i++){
          var employeeId = xls_utils.encode_cell({c:0, r:i});
          var employeeIdValue = sheet[employeeId];
          var name = xls_utils.encode_cell({c:1, r:i});
          var nameValue = sheet[name];
          var email = xls_utils.encode_cell({c:2, r:i});
          var emailValue = sheet[email];
          var mobileNumber = xls_utils.encode_cell({c:3, r:i});
          var mobileNumberValue = sheet[mobileNumber];
          var department = xls_utils.encode_cell({c:4, r:i});
          var departmentValue = sheet[department];
          
          await Department.findOne({
            where:{'name':departmentValue['v']}
          })
          .then((departmentValueId)=>{departmentValue = departmentValueId["id"]});
          if(employeeIdValue!=null&&employeeIdValue!=undefined&&departmentValue!=undefined&&departmentValue!=null){  
            await Employee.create({
              employeeId:employeeIdValue['v'],
              name:nameValue['v'],
              email:emailValue['v'],
              mobileNumber:mobileNumberValue['v'],
              department: departmentValue,
              createdBy:req.user,
              updatedBy:req.user
            })
            .catch(error=>{rejectedEmployee.push(employeeIdValue['v'])});
          }
        }
        return res.status(200).send(rejectedEmployee);
      })
    }
  }
};