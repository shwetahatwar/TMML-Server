/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': 'isLoggedIn',
  // 'login':true,
  // 'login': true,
  AccessLevelController:{
  	'*':'isLoggedIn'
  },
  AppUserController:{
    '*':'isLoggedIn'
  },
  CellController:{
    '*':'isLoggedIn'
  },
  CostCenterController:{
    '*':'isLoggedIn'
  },
  JobCardController:{
    '*':'isLoggedIn'
  },
  JobProcessSequenceRelationController:{
    '*':'isLoggedIn'
  },
  JobToJobReroutingController:{
    '*':'isLoggedIn'
  },
  LocationController:{
    '*':'isLoggedIn'
  },
  MachineController:{
    '*':'isLoggedIn'
  },
  MachineGroupController:{
    '*':'isLoggedIn'
  },
  MachineTypeController:{
    '*':'isLoggedIn'
  },
  MaintenanceTransactionController:{
    '*':'isLoggedIn'
  },
  MaterialTypeController:{
    '*':'isLoggedIn'
  },
  PartNumberController:{
    '*':'isLoggedIn'
  },
  ProcessSequenceController:{
    '*':'isLoggedIn'
  },
  ProcessSequenceMachineRelationController:{
    '*':'isLoggedIn'
  },
  ProductionScheduleController:{
    '*':'isLoggedIn'
  },
  ProductionSchedulePartRelationController:{
    '*':'isLoggedIn'
  },
  RawMaterialController:{
    '*':'isLoggedIn'
  },
  RoleAccessRelationController:{
    '*':'isLoggedIn'
  },
  TrolleyController:{
    '*':'isLoggedIn'
  },
  TrolleyTypeController:{
    '*':'isLoggedIn'
  },
  UserMasterController:{
    '*':'isLoggedIn'
  },
};
