var jwt = require('jsonwebtoken');
module.exports = function(req,res,next) {
  // console.log(req.user);
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], 'BRIOTTMMLMACHINESHOPWIPIIOT', function(err, decode) {
      // console.log(req.user);
      if (err) req.user = undefined;
      req.user = decode;
      // next();
    });
  } else {
    req.user = undefined;
    // next();
  }
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }
}