/**
 * RoleAccessRelationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function(req,res){
  	var newRoleAccessRelation;
		var newAccessLevel = await AccessLevel.find({
			uri:req.body.uri
		});
		if(newAccessLevel[0] != null && newAccessLevel[0] != undefined){
			var newRole = await Role.find({
				roleName: req.body.roleName
			});
			if(newRole[0] != null && newRole[0] != undefined){
				for(var i=0;i<newAccessLevel.length;i++){
					newRoleAccessRelation = await RoleAccessRelation.create({
						roleId: newRole[0]["id"],
						accessId: newAccessLevel[i]["id"]
					}).fetch();
				}
			}
		}
		res.send(newRoleAccessRelation);
  }

};
