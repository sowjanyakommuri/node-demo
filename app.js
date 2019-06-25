//const fs = require('fs');
var http = require('http');
var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//var engines = require('consolidate');

//app.engine('html', engines.mustache);
app.engine('html',require('ejs').renderFile);
app.set('view engine', 'html');

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
//mongoose.connect("mongodb://localhost:27017/node-demo");
mongoose.connect("mongodb://node-demo-test:aAYQIPrKRYprVC1aL3LPU70iNg87LQbJDaworr4MM080sGxOD4zO35RDPqAIzPQhUQJ1e5BTSoMvoDGtoc9U9g==@node-demo-test.documents.azure.com:10255/?ssl=true&replicaSet=globaldb/node-demo");
var nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
});
var User = mongoose.model("User", nameSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/addname", (req, res) => {
    var myData = new User(req.body);
    myData.save()
        .then(item => {
            res.send("Name saved to database");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
});

//app.set('view engine', 'html');

app.get("/getdetails", (req, res) => {
    
    User.find(function (err, userdata) {
        if (err) {
			console.log("Unable to get data from database");
            res.send(err);
        }
		console.log("get req send"+userdata);
		
       //res.send(userdata);

	    res.render('userdetails',{userdata: userdata});
	 
		
    });
       
});

app.get('/deleteuser/:id', function(req, res){
	console.log("delete");	
	User.remove({firstName: req.params.id}, 
	   function(err){
		if(err){
        console.log("delete error");			
		res.json(err);
		}
		else    res.send('delete success');
	});
});


app.get('/updateuser/:id', function(req, res) {
var name = req.params.id;
var lastName = "updated";
console.log("input param"+name);

User.update({ firstName: name}, {lastName: lastName}, function(err,log) {
	console.log("no.of files effected"+log);
    res.send('update success'+name)
});

});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});