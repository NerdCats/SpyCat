var express = require('express');
var calculate = require('./calculate');
var cors = require('cors')
var app = express();
app.use(cors());

var bodyParser = require('body-parser');

var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://gofetch.cloudapp.net:27017/taskcat';

var port = process.env.PORT || 8080;
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


router.get('/', function(req, res){
	res.json({ message: 'hooray! welcome to our api!' });
	console.log("home : ");
});

router.get('/report', function (req, res) {
	console.log("report : ");
	console.log(req.query);
	var jobs = [];
	var startdate = req.query.startdate;
	var enddate = req.query.enddate;
	var userType = req.query.usertype || "ENTERPRISE";
	console.log(userType)
	console.log(startdate + "  " + enddate);
	MongoClient.connect(url, function (err, db) {
		assert.equal(null, err);		
		var cursor = db.collection('Jobs').find({
		    "CreateTime" : {
		        $gte: new Date(startdate),
		        $lt: new Date(enddate),
		    },
		    "User.Type" : userType
		});
		cursor.each(function (err, doc) {
			assert.equal(err, null);
			if(doc!=null){				
				jobs.push(doc);
			} else {
				db.close();				
				var data = calculate.summaryReport(jobs);				
				res.json({ data });
			}
		})
	});	
})

app.use('/api', router);

app.listen(port);
console.log('Magic happends on port ' + port);