var express = require('express');
var calculate = require('./calculate');
var utility = require('./utility');
var queryMaker = require('./queryMaker');
var excelCreator = require('./excelCreator');
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


// Parameters:
// usertype = USER BIKE_MESSENGER ENTERPRISE
// userid = Asset's user id
// startdate = ISOdate
// enddate = ISOdate
// generateexcel = boolean

router.get('/report', function (req, res) {
	console.log("\n\n/report : ");
	console.log(req.query);
	
	var paramValid = utility.reportParamChecker(req);
	if (!paramValid.valid) {
		res.json({ error : paramValid.msg })
	} else {		
		var report = {};
		MongoClient.connect(url, function (err, db) {
			assert.equal(null, err);
			var query = queryMaker.reportQuery(req);
			var cursor = db.collection('Jobs').find(query);
			cursor.each(function (err, job) {
				assert.equal(err, null);
				if(job!=null){				
					report = calculate.summaryReport(req, report, job);
				} else {
					db.close();
					if (req.query.generateexcel == "true") {
						var excelReport = excelCreator.getSummaryReport(report);
						
						excelReport.workbook.save(function(ok){
							console.log(ok)
							console.log(excelReport.workbookFilePath)
							if (!ok) {								
								res.download(excelReport.workbookFilePath);
							} else							
								res.json({ errorMessage: "couldn't create excel report!"});
						});						
					} else {
						res.json({ data: report });
					}
				}
			})
		});
	}
});



// Parameters:
// usertype = USER BIKE_MESSENGER ENTERPRISE
// userid = Asset's user id
// startdate = ISOdate
// enddate = ISOdate
// generateexcel = boolean
router.get('/details', function (req, res) {
	var paramValid = utility.reportParamChecker(req);
	if (!paramValid.valid) {
		res.json({ error : paramValid.msg })
	} else {		
		var report = [];
		MongoClient.connect(url, function (err, db) {
			assert.equal(null, err);
			var query = queryMaker.reportQuery(req);
			console.log(req.query.generateexcel);
			console.log(query)
			var cursor = db.collection('Jobs').find(query);
			cursor.each(function (err, job) {
				assert.equal(err, null);
				if(job!=null){
					var entry = calculate.detailsReport(report, job);				
					report.push(entry);
				} else {
					db.close();
					if (req.query.generateexcel == "true") {
						var excelReport = excelCreator.getDetailsReport(report);
						
						excelReport.workbook.save(function(ok){
							console.log(ok)
							console.log(excelReport.workbookFilePath)
							if (!ok) {								
								res.download(excelReport.workbookFilePath);
							} else							
								res.json({ errorMessage: "couldn't create excel report!"});
						});						
					} else {
						res.json({ data: report });
					}
				}
			})
		});
	}
});



app.use('/api', router);

app.listen(port);
console.log('Magic happends on port ' + port);