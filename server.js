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
var productDbUrl = 'mongodb://gofetch.cloudapp.net:27017/test';

var port = process.env.PORT || 8000;
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

router.get('/user-list', function (req, res) {
	var paramValid = utility.userListParamChecker(req);
	console.log(paramValid);
	if (!paramValid.valid) {
		res.json({ error : paramValid.msg });
	} else {
		var report = [];
		MongoClient.connect(url, function (err, db) {
			assert.equal(null, err);
			var query = queryMaker.userListQuery(req);
			console.log({"Type" : req.query.usertype}, {"_id": 1, "UserName": 1});
			var userList = db.collection('Users').find({"Type" : req.query.usertype}, {"_id": 1, "UserName": 1}).toArray(function (err, result) {
				console.log(result.length)
				if (err) {
			    	console.log(err);
			    } else if (result.length) {			    	
			        res.json({ data: result })
			      } else {
			      	res.json({ error: "No document(s) found with defined find criteria!" })			      
			      }
			      //Close connection
			      db.close();
			});
			
		})
	}
})

router.post('/product', function (req, res) {
	console.log(req.body);
	var product = req.body;
	MongoClient.connect(productDbUrl, function (err, db) {
		assert.equal(null, err);
		db.collection('stores').insert(product, function (err, result) {
			assert.equal(null, err);
			db.close();
			res.json({ msg: "successfull" });		
		});
	})
})

router.get('/store-search', function (req, res) {
	var area = req.query.area;
	var keyword = req.query.keyword;
	var stores = [];
	var query = queryMaker.productSearchQuery(area, keyword);
	
	console.log(query)
	MongoClient.connect(productDbUrl, function (err, db) {
		var cursor = db.collection('stores').find(query);
		cursor.each(function (err, store) {
			// console.log(store)
			if (store!== null) {
				var _store = {
					Email: 				store.Email,
					Logo: 				store.Logo,
					Image: 				store.Image,
					PhoneNumber: 		store.PhoneNumber,
					Address: 			store.Address,
					Type:				store.Type,
					EnterpriseUserId: 	store.EnterpriseUserId,
					StoreName: 			store.StoreName,
					StoreId: 			store.StoreId,
					ProductCategories: 	store.ProductCategories,
					SupportedAreas : 	store.SupportedAreas
				};
				stores.push(_store);   		 
			} else {
				db.close();
				console.log("closing db")
				res.json({ data: stores })
			}			
		})
	})
})

router.get('/store', function (req, res) {
	var ObjectId = require('mongodb').ObjectID;
	var storeName =  new RegExp(req.query.storename, 'i');
	console.log(req.query.storeid)
	MongoClient.connect(productDbUrl, function (err, db) {
		db.collection('stores').findOne({ StoreName: storeName}, function (err, doc) {			
			db.close();
			res.json({store: doc})
		});
		
	})
})



router.post('/subscribe', function (req, res) {
	console.log(req.body);
	var email = req.body;
	MongoClient.connect(productDbUrl, function (err, db) {
		assert.equal(null, err);
		db.collection('subscribed').insert(email, function (err, result) {
			assert.equal(null, err);
			db.close();
			res.json({ msg: "successfull" });		
		});
	})
})
app.use('/api', router);

app.listen(port);
console.log('Magic happends on port ' + port);
