const express = require('express');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./model/User");
const Product = require("./model/Product");
	
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// mongoose.connect('mongodb://127.0.0.1/boutiqueDB');
// const mongoURI = 'mongodb://127.0.0.1/boutiqueDB'; //mongodb+srv://<username>:<password>@boutiquedb.y6u9b1k.mongodb.net/?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://userAdmin:Mnqobi0805@boutiquedb.4ulazw4.mongodb.net/?retryWrites=true&w=majority'); //"mongodb://127.0.0.1/boutiqueDB");
const mongoURI = 'mongodb+srv://userAdmin:Mnqobi0805@boutiquedb.4ulazw4.mongodb.net/?retryWrites=true&w=majority'; //'mongodb://127.0.0.1/boutiqueDB';

const dbConn = mongoose.createConnection(mongoURI);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(__dirname + '/'));

app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));
  
app.use(passport.initialize());
app.use(passport.session());
  
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// All users
app.get('/all-data', (req, res) =>{
    User.find()
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        console.log(err);
    })
});

// Admin users
app.get('/a-data/role/:name', (req, res) =>{
    const gt = User.find({ 'C_Role' : req.params.name})
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.get('/all-data/role/:name', async (req, res) =>{
    try {
        const gt = await User.findOne({ 'C_Contact.Email' : req.params.name });
        if(gt){
            var gh = gt._doc.C_Role.Name
            console.log(gh);
            res.send(gt);
        }
    } catch (error) {
        console.log(error);
    }
});

// All products
app.get('/all-products', (req, res) =>{
    Product.find()
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        console.log(err);
    })
});

// products by category
app.get('/all-products/:category', (req, res) =>{
    Product.find({ 'P_Catalog': req.params.category })
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        console.log(err);
    })
});

// Single product
app.get('/all-products/:name', (req, res) =>{
    Product.find({ 'P_Item' : req.params.name})
    .then((result)=>{
        res.send({ result: result });
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.get('/item/:name', (req, res) =>{
    Product.find({ 'P_Item' : req.params.name})
    .then((result)=>{
        res.send({ result: result });
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.get('/api/members/active', async (req, res) => {
    try{



        const usr = await User.getAll();
        res.send(usr);
        console.log(usr);
    } catch (error) {
        console.log(error);
    }    
});

app.get('/', async function (req, res) {
	try{
		const prod = await Product.find();
		if(prod){
			if(req.session.User){
				res.render('pages/index', { user: req.session.User, products:  prod});
			} else{
				res.render('pages/index', { user: 'None', products:  prod });
			}
		} else{
			console.log('Nothimg to show, no products');
		}
	} catch(err){
		console.log(err + ' Nothimg to show, no products');
	}
	
});

app.get("/index", async function(req, res) {
    try{
		const prod = await Product.find();
		if(prod){
			if(req.session.User){
				res.render('pages/index', { user: req.session.User, products:  prod});
			} else{
				res.render('pages/index', { user: 'None', products:  prod });
			}
		} else{
			console.log('Nothimg to show, no products');
		}
	} catch(err){
		console.log(err + ' Nothimg to show, no products');
	}
		
});

app.get('/about', function (req, res) {
    if(req.session.User){
	    res.render('pages/about', { user: req.session.User });
    }else{
        res.render('pages/about', { user: 'None' });
    }
});

app.get('/testimonial', function (req, res) {
    if(req.session.User){
	    res.render('pages/testimonial', { user: req.session.User });
    }else{
        res.render('pages/testimonial', { user: 'None' });
    }
});

app.get('/item', function (req, res) {
    if(req.session.User){
	    res.render('pages/item', { user: req.session.User, item: req.query.name });
    }else{
        res.render('pages/item', { user: 'None', item: req.query.name });
    }
});

app.get('/items', async function (req, res) {
	try{
		const prod = await Product.find();
		if(prod){
			if(req.session.User){
				res.render('pages/items', { user: req.session.User, products:  prod});
			} else{
				res.render('pages/items', { user: 'None', products:  prod });
			}
		} else{
			console.log('Nothimg to show, no products');
		}
	} catch(err){
		console.log(err + ' Nothimg to show, no products');
	}
});

app.get('/login', function (req, res) {
    if(req.session.User){
        res.render('pages/account', { user: req.session.User, error: '' });
    } else{
        res.render('pages/account', { user: 'None', error: '' });
    }
});

app.get('/register', function (req, res) {
    if(req.session.User){
	    res.render('pages/register', { user: req.session.User });
    }else{
        res.render('pages/register', { user: 'None' });
    }
});

app.get('/checkout', function (req, res) {
    if(req.session.User){
	    res.render('pages/checkout', { user: req.session.User });
    }else{
        res.render('pages/checkout', { user: 'None' });
    }
});

app.get('/contact', function (req, res) {
    if(req.session.User){
	    res.render('pages/contact', { user: req.session.User });
    }else{
        res.render('pages/contact', { user: 'None' });
    }
});


// Backoffice
app.get('/dashboard/home', async function (req, res) {
    try {
        // check if user is Admin
        const userAdmn = await User.find({ 'C_Contact.Email': req.session.User.C_Contact.Email, 'C_Role.Name': { $exists: true }}); //.find({ 'C_Role.Name': { $ne: null } });  //[0]._doc.C_Role.Name === 'Admin';
        if(userAdmn.length == 1){
            res.render("office/index", { user: req.session.User });
        } else {
            req.session.valid = null;
            res.redirect('/');
        }
    } catch (error) {
        console.log(error);
        req.session.valid = null;
        res.redirect('/');
    }


});

app.get('/dashboard/bags', function (req, res) {
    if(req.session.User){
        res.render('office/bags', { user: req.session.User });
    } else {
        req.session.valid = null;
        res.redirect('/');
    }
});

app.get('/dashboard/calendar', function (req, res) {
    if(req.session.User){
        res.render('office/calendar', { user: req.session.User });
    } else {
        req.session.valid = null;
        res.redirect('/');
    }
});

app.get('/dashboard/catalog', async function (req, res) {
    try{
		const prod = await Product.find();
		if(prod){
			if(req.session.User){
				res.render('office/catalog', { user: req.session.User, products:  prod});
			} else{
				req.session.valid = null;
                res.redirect('/');
			}
		} else{
			console.log('Nothing to show, no products');
		}
	} catch(err){
		console.log(err + ' Nothing to show, no products');
    }
});

app.get('/dashboard/faq', function (req, res) {
    if(req.session.User){
        res.render('office/faq', { user: req.session.User });
    } else {
        req.session.valid = null;
        res.redirect('/');
    }
});

app.get('/dashboard/details', function (req, res) {
    res.render('office/details', { user: req.session.User });
});

app.get('/dashboard/contact', function (req, res) {
    res.render('office/contact');
});

app.get('/dashboard/checkout', function (req, res) {
    res.render('office/checkout');
});

app.get('/dashboard/settings', function (req, res) {
    if(req.session.User){
        res.render('office/settings', { user: req.session.User });
    } else {
        req.session.valid = null;
        res.redirect('/');
    }
});

app.get('/dashboard/input', function (req, res) {
    res.render('office/input');
});

app.get('/dashboard/mail', function (req, res) {
    if(req.session.User){
        res.render('office/mail', { user: req.session.User });
    } else {
        req.session.valid = null;
        res.redirect('/');
    }
});

app.get('/dashboard/approved', function (req, res) {
    if(req.session.User){
        res.render('office/approved', { user: req.session.User });
    } else {
        req.session.valid = null;
        res.redirect('/');
    }
});

app.get('/dashboard/pending', function (req, res) {
    if(req.session.User){
        res.render('office/pending', { user: req.session.User });
    } else {
        req.session.valid = null;
        res.redirect('/');
    }
});

app.get('/dashboard/rejected', function (req, res) {
    if(req.session.User){
        res.render('office/rejected', { user: req.session.User });
    } else {
        req.session.valid = null;
        res.redirect('/');
    }
});

app.get('/dashboard/reports', function (req, res) {
    if(req.session.User){
        res.render('office/reports', { user: req.session.User });
    } else {
        req.session.valid = null;
        res.redirect('/');
    }
});

app.get('/dashboard/profile', async function (req, res) {
    try {
        if(req.session.User){
            // check if user is Admin
            const userAdmn = await User.find({ 'C_Contact.Email': req.session.User.C_Contact.Email, 'C_Role.Name': { $exists: true }}); //.find({ 'C_Role.Name': { $ne: null } });  //[0]._doc.C_Role.Name === 'Admin';
            if(userAdmn.length == 1){
                const users = await User.find();
                res.render("office/profile", { user: req.session.User, allUsers: users });
            } else {
                req.session.valid = null;
                res.redirect('/');
            }
        } else {
            req.session.valid = null;
            res.redirect('/');
        }
    } catch (error) {
        console.log(error);
        req.session.valid = null;
        res.redirect('/');
    }
});

app.get('/dashboard/validation', function (req, res) {
    res.render('office/validation');
});

app.get('/dashboard/locked', function (req, res) {
    if(req.session.User){
        res.render('office/lock', { user: req.session.User });
    } else {
        req.session.valid = null;
        res.redirect('/');
    }
});

app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const postData = {
        members: [
            {
                email_address: email,
                status:"subscribed",
                merge_fields: {
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    }
    const jsonPostData = JSON.stringify(postData);

    console.log(req.body);
   
    const url = "https://us8.api.mailchimp.com/3.0/lists/YOUR_LIST_ID";
    const options = {
        method: 'POST',
        auth: "YOUR-API-KEY"
    }

    const request = https.request(url, options, function(response){
        console.log('status code: ' + response.statusCode);

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
    })
    request.write(jsonPostData);
    request.end();

});

app.post("/failure", function(req,res){
    res.redirect("/");
});

// Handling user signup
app.post("/register", async(req,res) => {
    try {
        const userZ = await User.find({ 'C_Contact.Email': req.body.email });
        if(!userZ){
            const user = await User.create({
                C_Name: req.body.name,
                C_Surname: req.body.surname,
                C_Contact: { 
                    Cellphone: req.body.number,
                    Email: req.body.email
                },
                C_Password: req.body.password,
                C_Joined: new Date().toLocaleString(),
                C_Active: "Active"
            });
        }
    } catch (error) {
        console.log(error, " User with the same email already exists.")
    }
    

    // res.status(200).json(user);
	
    res.render("pages/account", { user: 'None', error: '' });
});

// Handling user login
app.post("/login", async function(req,res){
    try{
        // check if user exist
        const userZ = await User.findOne({ 'C_Contact.Email': req.body.email_log });
        if(userZ){
            // check if password matches
            const result = req.body.password_log === userZ._doc.C_Password;
            if(result){
                req.session.User = userZ;
                res.render("pages/account", { user: userZ._doc, error: 'You have successfully logged in.' });
            } else{
                res.render("pages/account", { user: 'None', error: 'Password does not match!' });
                // res.status(400).json({ error: "Password doesn't match"});
            }
        } else{
            res.render("pages/account", { user: 'None', error: 'User does not exist!' });
            // res.status(400).json({ error: "User doesn't exist"});
        }
    } catch (error){
        res.status(400).json({ error });
    }
});

// Handling Admin login
app.post("/dashboard/home", async function(req,res){
    try{
        // check if user exist
        const userZ = await User.findOne({ 'C_Contact.Email': req.body.email_log });
        if(userZ){
            // check if password matches
            const result = req.body.password_log === userZ._doc.C_Password;
            if(result){
                req.session.User = userZ;
                res.locals.user = req.session.User;
                // check if user is Admin
                const userAdmn = await User.find({ 'C_Contact.Email': req.body.email_log, 'C_Role.Name': { $exists: true }}); //.find({ 'C_Role.Name': { $ne: null } });  //[0]._doc.C_Role.Name === 'Admin';
                if(userAdmn.length == 1){
                    res.render("office/index", { user: userZ._doc, error: '' });
                } else{
                    req.session.User = userZ;
                    res.render("pages/account", { user: userZ._doc, error: 'You have successfully logged in.' });
                }
            } else{
                res.render("pages/account", { user: 'None', error: 'Password does not match!' });
                // res.status(400).json({ error: "Password doesn't match"});
            }
        } else{
            res.render("pages/account", { user: 'None', error: 'User does not exist!' });
            // res.status(400).json({ error: "User doesn't exist"});
        }
    } catch (error){
        res.status(400).json({ error });
    }
});

//Handling user logout 
app.get("/logout", async function (req, res) {
    const prod = await Product.find();
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.valid = null;

		if(prod){
            res.render('pages/index', { user: 'None', products:  prod });
        }
  });
});

// Handling login function 
async function isLogIn(req, res) {
    try{
        // check if user exist
        const userZ = await User.findOne({ 'C_Contact.Email': req.body.email_log });
        if(userZ){
            // check if password matches
            const result = req.body.password_log === userZ._doc.C_Password;
            if(result){
                req.session.User = userZ;
                res.locals.user = req.session.User;
                // check if user is Admin
                const userAdmn = await User.find({ 'C_Contact.Email': req.body.email_log, 'C_Role.Name': { $exists: true }}); //.find({ 'C_Role.Name': { $ne: null } });  //[0]._doc.C_Role.Name === 'Admin';
                if(userAdmn.length == 1){
                    res.render("office/index", { user: userZ._doc, error: '' });
                } else{
                    res.redirect("pages/account", { user: userZ._doc, error: 'You have successfully logged in.' });
                }
            } else{
                res.render("pages/account", { user: 'None', error: 'Password does not match!' });
                // res.status(400).json({ error: "Password doesn't match"});
            }
        } else{
            res.render("pages/account", { user: 'None', error: 'User does not exist!' });
            // res.status(400).json({ error: "User doesn't exist"});
        }
    } catch (error){
        res.status(400).json({ error });
    }
};

// Handling login function 
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.render("pages/account");
}

// middleware to make 'user' available to all templates. Then try referring to res.locals.user rather than the request object.
app.use(function(req, res, next) {
    res.locals.user = req.session.User;
    next();
 });

// app.listen(process.env.PORT || 3000, console.log("Server running on port " +  server.address().port));

app.set('port', process.env.PORT || 4000);
var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});

