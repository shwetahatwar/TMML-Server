var jwt = require('jsonwebtoken');
module.exports = function(req,res,next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], 'BRIOTTMMLMACHINESHOPWIPIIOT', function(err, decode) {
      console.log("isLoggedIn - user decode: ", decode);
      if (err) {
        console.log("isLoggedIn - Error in authentication: ", err);
        req.user = undefined;
      } else if (decode && decode.userid){
        console.log("Is Logged In",req.body);
        console.log("isLoggedIn - valid decode user: ", decode);
        req.user = decode;
        if (req.body) {
          if (!req.body.createdBy) {
            req.body.createdBy = decode.userid;
          }
          req.body.updatedBy = decode.userid;
        }
      }
      // next();
    });
  } else {
    req.user = undefined;
    // next();
  }
  if (req.user && req.user != undefined) {
    console.log("isLoggedIn - user found");
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }
}
