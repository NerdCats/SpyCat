var express = require('express');
var app = express();
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
	var data = [];
	MongoClient.connect(url, function (err, db) {
		assert.equal(null, err);
		var cursor = db.collection('Jobs').find();
		cursor.each(function (err, doc) {
			assert.equal(err, null);
			if(doc!=null){
				console.log(doc.HRID)
				data.push(doc.HRID);
			} else {
				db.close();
			}
		})
	})
	res.json({ data });
	console.log("report : ")
})

app.use('/api', router);

app.listen(port);
console.log('Magic happends on port ' + port);