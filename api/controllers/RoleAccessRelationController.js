/**
 * RoleAccessRelationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 module.exports = {
 	create: async function(req,res){
 		// await RoleAccessRelation.update({
 		// 	roleId: { '!=' : 1 }
 		// })
 		// .set({
 		// 	status: 0
 		// });

 		var newRoleAccessRelation;
 		console.log(req.body.roleName,req.body.uri);
 		var newAccessLevel = await AccessLevel.find({
 			uri:req.body.uri
 		});
 		if(newAccessLevel[0] != null && newAccessLevel[0] != undefined){
 			var newRole = await Role.find({
 				roleName: req.body.roleName
 			});
 			if(newRole[0] != null && newRole[0] != undefined){
 				for(var i=0;i<newAccessLevel.length;i++){
 					console.log("roleId",newRole[0]["id"]);
 					console.log("accessId",newAccessLevel[i]["id"]);
 					var isAvailable = newRoleAccessRelation = await RoleAccessRelation.find({
 						roleId: newRole[0]["id"],
 						accessId: newAccessLevel[i]["id"]
 					});
 					if(isAvailable[0] != null && isAvailable != undefined && req.body.status == 1){
 						newRoleAccessRelation = await RoleAccessRelation.update({
 							roleId: newRole[0]["id"],
 							accessId: newAccessLevel[i]["id"]
 						})
 						.set({
 							status: 1
 						});
 					}
 					else if(isAvailable[0] != null && isAvailable != undefined && req.body.status == 0){
 						newRoleAccessRelation = await RoleAccessRelation.update({
 							roleId: newRole[0]["id"],
 							accessId: newAccessLevel[i]["id"]
 						})
 						.set({
 							status: 0
 						});
 					}
 					else if(req.body.status == 1){
 						newRoleAccessRelation = await RoleAccessRelation.create({
 							roleId: newRole[0]["id"],
 							accessId: newAccessLevel[i]["id"],
 							status:1
 						}).fetch();
 					}
 				}
 			}
 		}
 		res.send(newRoleAccessRelation);
 	}
 };



