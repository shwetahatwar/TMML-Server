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
  'POST /partNumberBulkUploadExcel': 'PartNumber.bulkUpload',
  'POST /partNumberProcessSequenceBulkUploadExcel': 'ProcessSequence.bulkUpload',
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
  'PUT /Joblocationrelation/update': 'Joblocationrelation.update',
  'POST /employeeBulkUpload': 'Employee.employeeBulkUpload',
  'GET /Joblocationrelation/getData': 'Joblocationrelation.getData',
  'GET /JobProcessSequenceRelation/getData': 'JobProcessSequenceRelation.getData',
  'POST /stopProcessSequence': 'JobProcessSequenceRelation.stopProcess',
  'POST /Trolley/create': 'Trolley.create',
  'POST /parseJson': 'SapPartNumberController.parseJson',
  'GET /getPartSMHZero': 'PartNumberController.getPartSMHZero',
  'GET /getJobcardCount':'JobCard.getJobcardCount',
  'GET /getCell':'JobCard.getCell',
  'GET /updatePartNumberLocation':'SetupDataUploadController.updatePartNumberLocation',
  'POST /manaulProcessSequqenceUpdate':'ProcessSequence.manaulProcessSequqenceUpdate',
  'GET /getJobCardCompletedToday':'JobCard.getJobCardCompletedToday',
  'GET /Joblocationrelation/getDataDesktop': 'Joblocationrelation.getDataDesktop',
  'GET /getJobLocationRelationCount': 'Joblocationrelation.getJobLocationRelationCount',
  'POST /sap315': 'SapTransactionStore.sap315',
  'GET /getAllJobCardCount':'JobCard.getAllJobCardCount',
  'GET /getAllEmployeeCount':'GetCount.getAllEmployeeCount',
  'GET /getAllMachineCount':'GetCount.getAllMachineCount',
  'GET /getAllLocationCount':'GetCount.getAllLocationCount',
  'GET /getAllRawMaterialCount':'GetCount.getAllRawMaterialCount',
  'GET /getAllPartNumbersCount':'GetCount.getAllPartNumbersCount',
  'GET /getAllPendingPartNumbersCount':'GetCount.getAllPendingPartNumbersCount',
  'GET /getAllProductionScheduleCount':'GetCount.getAllProductionScheduleCount',
  'GET /getAllMonthlyScheduleCount':'GetCount.getAllMonthlyScheduleCount',
  'GET /getAllDailyScheduleIdCount':'GetCount.getAllDailyScheduleIdCount',
  'GET /getAllMonthlyScheduleIdCount':'GetCount.getAllMonthlyScheduleIdCount',
  'GET /getLogisticsCount':'GetCount.getLogisticsCount',
  'GET /getProcessDataFeedCount':'GetCount.getProcessDataFeedCount',
  'GET /getAllRerouteCount':'GetCount.getAllRerouteCount',
  'GET /getSapDataCount':'GetCount.getSapDataCount',
  'GET /getUserCount':'GetCount.getUserCount',
  'GET /getInProgressJobCount':'GetCount.getInProgressJobCount',
  'GET /getCompletedJobCount':'GetCount.getCompletedJobCount',
  'GET /getJobCardSequence':'GetCount.getJobCardSequence',
  'GET /getJobCardCountShiftWise':'JobCard.getJobCardCountShiftWise',
  'GET /getJobCardsShiftWise':'JobCard.getJobCardsShiftWise',
  'GET /getPartCell':'JobCard.getPartCell',
  'POST /soapRequestPost1': 'SapTransactionStore.soapRequestPost1',
  'POST /sap315': 'SapTransactionStore.sap315',
  'GET /getMachineWiseData':'JobProcessSequenceRelation.getMachineWiseData',
  'POST /get313Data':'SapPartNumberController.get313Data',
  'POST /getAllProcessJobCard': 'JobCard.getAllProcessJobCard',
  'POST /getJobCardByMachine': 'JobCard.getJobCardByMachine',
  'GET /getAllCompletedCount':'GetCount.getAllCompletedCount',
  'GET /getJobProcessSequenceRelation':'JobProcessSequenceRelation.getJobProcessSequenceRelation',
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
