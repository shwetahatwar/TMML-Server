/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Sails/Express middleware to run for every HTTP request.                   *
  * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
  *                                                                           *
  * https://sailsjs.com/documentation/concepts/middleware                     *
  *                                                                           *
  ****************************************************************************/

  middleware: {

    /***************************************************************************
    *                                                                          *
    * The order in which middleware should be run for HTTP requests.           *
    * (This Sails app's routes are handled by the "router" middleware below.)  *
    *                                                                          *
    ***************************************************************************/

    // order: [
    //   'cookieParser',
    //   'session',
    //   'bodyParser',
    //   'compress',
    //   'poweredBy',
    //   'router',
    //   'www',
    //   'favicon',
    // ],
    passportInit    : require('passport').initialize(),
    passportSession : require('passport').session(),

    order: [
           'cookieParser',
           'session',
           'passportInit',
           'passportSession',
           'extendTimeout',
           'bodyParser',
           'compress',
           'poweredBy',
           'router',
           'www',
           'favicon',
         ],

    /***************************************************************************
    *                                                                          *
    * The body parser that will handle incoming multipart HTTP requests.       *
    *                                                                          *
    * https://sailsjs.com/config/http#?customizing-the-body-parser             *
    *                                                                          *
    ***************************************************************************/

    extendTimeout:(function (){
      return function(req,res,next){
        //sails.log.info('Extended to 1h');
        req.setTimeout(3600000);
        return next();
      };
    })(),
    bodyParser: (function (){
      var opts = {limit:10000000,parameterLimit:10000};
      var fn;

      fn = require('skipper');
      return fn(opts);
      // var skipper = require('skipper');
      // var middlewareFn = skipper({ strict: true });
      // return middlewareFn;
    })(),

  },

};
