// Product.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
var Product = new Schema({
	P_Name: {
		type: String,
		required: true
	},
	P_Desc: {
		type: String,
		required: true
	},
	P_Price: {
		type: String,
		required: true
	},
	P_Item: {
		type: String,
		required: true
	},
	P_Code: {
		type: String,
		required: true
	},
	P_Details: {
		Color: {
			type: String,
			required: true
		},
		Size: {
			type: String,
			required: true
		}
	},
	P_Img: {
		type: String,
		required: true
	},
	P_Catalog: {
		type: String,
		required: true
	},
	P_Joined: {
		type: Date,
		default: Date.now
	},
	P_Active: {
		type: String
	},
	P_Tag: {
		type: String,
		required: true
	}
})

Product.plugin(passportLocalMongoose);

// module.exports = mongoose.model('Product', Product)

var boutique = module.exports = mongoose.model('products', Product);

//All products
module.exports.getAll = () => {
	boutique.find({ P_Active: 'Active' });
}

