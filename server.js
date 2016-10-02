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
					 	sheet1.set(1, 1, 'I am title');
						for (var i = 2; i < 5; i++)
						sheet1.set(i, 1, 'test'+i);

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