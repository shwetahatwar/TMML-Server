/**
 * MachineStrokesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  jobstrokes: async function (req, res) {
    // console.log("Stroke");
    var mId = 1;
    var strokes = 1;
    var multifactor = 1;

    if (mId != "" && strokes != undefined && multifactor != undefined) {
      var strokesCount = parseInt(strokes);
      var multiFactor = parseInt(multifactor);
      var result = await MachineStrokes.findOne({machineId: mId, endTime: 0, multifactor: multiFactor});
      // console.log(result);
      if (result != undefined) {
        result.strokes += strokesCount;
        var response = await MachineStrokes.update({"id": result.id}).set({machineId: mId, multifactor: multiFactor, strokes: result.strokes}).fetch();
        // return res.send('mm');
      } else {
        return res.status(404).send('Record not found.');

      }
    } else {
      return res.status(400).send('invalid input body parameter(s)');
    }
  }

};

