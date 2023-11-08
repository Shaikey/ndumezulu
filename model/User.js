// User.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
var User = new Schema({
	C_Name: {
		type: String,
		required: true
	},
	C_Surname: {
		type: String,
		required: true
	},
	C_Contact: {
		Cellphone: {
			type: String,
			required: true
		},
		Email: {
			type: String,
			required: true
		}
	},
	C_Password: {
		type: String,
		required: true
	},
	C_Joined: {
		type: Date,
		default: Date.now
	},
	C_Active: {
		type: String
	}
})

User.plugin(passportLocalMongoose);

// module.exports = mongoose.model('User', User)

var boutique = module.exports = mongoose.model('customers', User);

//All users
module.exports.getAll = () => {
	boutique.find({ C_Active: 'Active' });
}

module.exports.getUser = (mailId) => {
	boutique.find({ 'C_Contact.Email': mailId });
}

//Get Collection all Users
module.exports.getActiveUsers = function (options, callback) {
	boutique.find({ C_Active: 'Active' }, options, callback);
}

//Get Member: by Email
module.exports.getUserByMail = function (mailId, callback) {
    boutique.find({ 'C_Contact.Email': mailId }, callback);
}

//Get Member: by Id
module.exports.getMembersById = function (id, callback) {
    boutique.findById(id, callback);
}

//Add Member:
module.exports.addMember = function (member, callback) {
    boutique.create(member, callback);
}

//Update Member:
module.exports.updateMember = function (id, member, options, callback) {
    var query = { _id: id };
    var update = {
        name: member.C_Name,
        surname: member.C_Surname,
        cell: member.C_Contact[0].Cellphone,
        phone: member.C_Contact[1].Landphone,
        email: member.C_Contact[2].Email,
        password: member.C_Password,
        active: member.C_Active
    };

    boutique.findOneAndUpdate(query, update, options, callback);
}

//Delete Member:
module.exports.removeMember = function (id, callback) {
    var query = { _id: id };

    boutique.remove(query, callback);
}
