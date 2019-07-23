/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },
  'POST /login': 'AuthController.login',
  'POST /testupload':'TestUploadController.test',
  'POST /trolleyBulkUpload':'TrolleyBulkUploadController.upload',
  'POST /rawMaterialBulkUpload':'RawMaterialBulkUploadController.upload',
  'POST /employeeBulkUpload':'EmployeeBulkUploadController.upload',
  'POST /productionScheduleBulkUpload': 'ProductionScheduleBulkUpload.upload',
  'POST /partNumberBulkUpload': 'PartNumberBulkUpload.upload',
  'POST /iot/jobstrokes' : 'MachineStrokes.jobstrokes',
  'POST /ProductionSchedule/create' : 'ProductionSchedule.create',
  'POST /PartNumber/create' : 'PartNumber.create',
  'POST /PartNumber/newPart' : 'PartNumber.newPart',
  'PUT /MaintenanceTransaction/update' : 'MaintenanceTransaction.update',
  'POST /JobProcessSequenceRelation/create': 'JobProcessSequenceRelation.create',
  'PUT /JobProcessSequenceRelation/update': 'JobProcessSequenceRelation.update',
  'POST /JobToJobRerouting/create': 'JobToJobRerouting.create',
  'PUT /Logistics/update': 'Logistics.update',
  'POST /JobCard/create': 'JobCard.create',
  'POST /Machine/create': 'Machine.create',
  'PUT /Joblocationrelation/move': 'Joblocationrelation.move',
  'POST /Location/create': 'Location.create',
  'POST /seedDatabase': 'SetupDataUploadController.seedDatabase',
  'POST /sapPartNumber': 'SapPartNumberController.create',
  'POST /soapRequest': 'SapPartNumberController.soapRequestGet',
  'POST /soapRequest1': 'SapPartNumberController.soapRequest1',
  'POST /soapRequestPost': 'SapPartNumberController.soapRequestPost',
  'POST /monthlySchdeule': 'MonthlyScheduleController.create',
  'POST /dailyUpload': 'ProductionScheduleController.dailyUpload',
  'POST /dailyMonthlyReport': 'ProductionScheduleController.dailyMonthlyReport',
  'POST /getDetailJobCard': 'JobCard.getDetailJobCard',
  'POST /iot/getJobProcessQuantity': 'MachineStrokesController.getJobProcessQuantity',
  'POST /JobCardComplete': 'JobCard.completeJobCard',
  'GET /testMail': 'TestUpload.testMail',
  // 'GET  /logout': 'AuthController.logout',
  // 'GET  /logout': 'AuthController.logout',

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
