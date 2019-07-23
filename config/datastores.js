/**
 * Datastores
 * (sails.config.datastores)
 *
 * A set of datastore configurations which tell Sails where to fetch or save
 * data when you execute built-in model methods like `.find()` and `.create()`.
 *
 *  > This file is mainly useful for configuring your development database,
 *  > as well as any additional one-off databases used by individual models.
 *  > Ready to go live?  Head towards `config/env/production.js`.
 *
 * For more information on configuring datastores, check out:
 * https://sailsjs.com/config/datastores
 */

module.exports.datastores = {


  /***************************************************************************
  *                                                                          *
  * Your app's default datastore.                                            *
  *                                                                          *
  * Sails apps read and write to local disk by default, using a built-in     *
  * database adapter called `sails-disk`.  This feature is purely for        *
  * convenience during development; since `sails-disk` is not designed for   *
  * use in a production environment.                                         *
  *                                                                          *
  * To use a different db _in development_, follow the directions below.     *
  * Otherwise, just leave the default datastore as-is, with no `adapter`.    *
  *                                                                          *
  * (For production configuration, see `config/env/production.js`.)          *
  *                                                                          *
  ***************************************************************************/

  default: {

    /***************************************************************************
    *                                                                          *
    * Want to use a different database during development?                     *
    *                                                                          *
    * 1. Choose an adapter:                                                    *
    *    https://sailsjs.com/plugins/databases                                 *
    *                                                                          *
    * 2. Install it as a dependency of your Sails app.                         *
    *    (For example:  npm install sails-mysql --save)                        *
    *                                                                          *
    * 3. Then pass it in, along with a connection URL.                         *
    *    (See https://sailsjs.com/config/datastores for help.)                 *
    *                                                                          *
    ***************************************************************************/
    // adapter: 'sails-sql',
    // url: 'mssql://sa:briot123@192.168.0.6:1433/TestDatabase1',
    adapter: 'sails-postgresql',
    url: 'postgres://bnsliopfagjtkt:a27131100bed84cdf09b216d3ff6fa2afecf2936ac5359cbe1da866a835011f1@ec2-23-21-147-71.compute-1.amazonaws.com:5432/d6n877b1qc3e8o',
    ssl: true,
    // sqlserver: {
      // adapter: 'sails-mssqlserver',
      // user: 'sa',
      // password: 'briot123',
      // host: 'DESKTOP-FMUJ546\\SQLEXPRESS', // azure database
      // database: 'TestDatabase1',
      // options: {
      //   // encrypt: true   // use this for Azure databases
      // }
    // }

    // sqlserver: {
    //   adapter: 'sails-sqlserver',
    //   user: 'sa',
    //   password: 'briot123',
    //   host: 'localhost:1433',
    //   database: 'TestDatabase',
    //   // I've had to use this option in some cases
    //   // where the SQL Server refuses my user otherwise
    //   options: {
    //       encrypt: false
    //   }
    // },
  },


};
