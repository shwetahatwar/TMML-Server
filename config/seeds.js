/**
 * Sails Seed Settings
 * (sails.config.seeds)
 *
 * Configuration for the data seeding in Sails.
 *
 * For more information on configuration, check out:
 * http://github.com/frostme/sails-seed
 */
module.exports.seeds = {

  Department: [
    {
      name: 'Engineering',
      status: 0, // 0 for active, 1 for deactive
    },
    {
      name: 'Management',
      status: 0, // 0 for active, 1 for deactive
    },
    {
      name: 'Production',
      status: 0, // 0 for active, 1 for deactive
    },
    {
      name: 'Maintenance',
      status: 0, // 0 for active, 1 for deactive
    },
    {
      name: 'Store',
      status: 0, // 0 for active, 1 for deactive
    },
    {
      name: 'Logistics',
      status: 0, // 0 for active, 1 for deactive
    },
  ],
  TrolleyType: [
    {
      name: 'Simple',
    },
    {
      name: 'Joker',
    },
  ],

  Materialtype: [
    {
      name: 'Profile',
    },
    {
      name: 'Sheet',
    },
    {
      name: 'Pipe',
    },

  ],

}
