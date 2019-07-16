/**
 * MachineStrokesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  jobstrokes: async function (req, res) {
    // console.log("Stroke");
    var mId = req.body.machineId;
    var strokes = req.body.strokes;
    var multifactor = req.body.multifactor;

    if (mId != undefined && strokes != undefined && multifactor != undefined) {
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
  },

  getJobProcessQuantity: async function (req, res) {
    var mId = req.body.machineId;

    if (mId != undefined) {
      var strokesCount = 0;
      var result = await MachineStrokes.find({machineId: mId, endTime: 0});
      console.log("machineDetails: ", result);
      if (result != undefined ) {
        var quantity = result.strokes * result.multifactor;
        console.log("Proposed qantity: ", quantity);
        return res.status(200).send({machineId: result.id, proposedQuantity: quantity});
      } else {
        return res.status(404).send('Record not found.');

      }
    } else {
      return res.status(400).send('invalid input body parameter(s)');
    }
    return res.status(404).send('Record not found.');


  }

};
