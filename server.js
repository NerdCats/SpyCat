var express = require('express');
var excelbuilder = require('msexcel-builder');
var calculate = require('./calculate');
var utility = require('./utility');
var queryMaker = require('./queryMaker');
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
			console.log(req.query.generateexcel);
			console.log(query)
			var cursor = db.collection('Jobs').find(query);
			cursor.each(function (err, job) {
				assert.equal(err, null);
				if(job!=null){				
					report = calculate.summaryReport(req, report, job);
				} else {
					db.close();
					if (req.query.generateexcel == "true") {
						var directoryName = __dirname + "\\excel";
						var workbookName = Date.now().toString() + 'sample.xlsx';
						var reportFileName = directoryName + "\\" + workbookName;

					 	var workbook = excelbuilder.createWorkbook(directoryName, workbookName);					 	
					 	var sheet1 = workbook.createSheet('sheet1', 10, 12);
					 	//sheet1.set(column, row, value)
					 	//Object.keys(report.Assets)[0]
					 	sheet1.set(1, 1, 'Name');
					 	sheet1.set(2, 1, 'Delivery');
					 	sheet1.set(3, 1, 'Pending');
					 	sheet1.set(4, 1, 'InProgress');
					 	sheet1.set(5, 1, 'Completed');
					 	sheet1.set(6, 1, 'Cancelled');
					 	sheet1.set(7, 1, 'ProductPrice');
					 	sheet1.set(8, 1, 'DeliveryCharge');
						for (var row = 2; row <= 10; row++) {
							var reportBaseIndex = row - 2;
							var key = Object.keys(report)[reportBaseIndex];
							sheet1.set(1, row, key);
							sheet1.set(2, row, report[key].TotalDelivery);
						 	sheet1.set(3, row, report[key].TotalPending);
						 	sheet1.set(4, row, report[key].TotalInProgress);
						 	sheet1.set(5, row, report[key].TotalCompleted);
						 	sheet1.set(6, row, report[key].TotalCancelled);
						 	sheet1.set(7, row, report[key].TotalProductPrice);
						 	sheet1.set(8, row, report[key].TotalDeliveryCharge);
						}

						// Save it 
						workbook.save(function(ok){
							if (!ok) {
								// workbook.cancel();
								console.log(ok)
								console.log(reportFileName)
								res.download(reportFileName);
							} else							
								res.json({ date: "congratulations, your workbook created"});
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