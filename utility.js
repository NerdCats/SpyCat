module.exports = {
	reportParamChecker : function (params) {
		var isoDateRegex = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/i;

		if (!params.query.startdate) return {msg: "'startdate' is not available", valid: false}
		else if (!params.query.enddate) return {msg: "'enddate' is not available", valid: false}
		else if (!params.query.usertype && params.query.userid.length !== 24) return {msg: "'userid' is not available", valid: false}
		else if (!params.query.usertype && !params.query.userid) return {msg: "'usertype' is not available", valid: false}
		else if (!params.query.startdate.match(isoDateRegex))
			return {
				msg: "startdate '"+params.query.startdate+"' is not in proper ISO date format, ex: 2016-09-19T17:59:59.000Z",
				valid: false
			};
		else if (!params.query.enddate.match(isoDateRegex)) 
			return {
				msg: "enddate '"+params.query.enddate+"' is not in proper ISO date format, ex: 2016-09-19T17:59:59.000Z",
				valid: false
			};
		else if (params.query.usertype != "ENTERPRISE" && params.query.usertype != "USER"
		&& params.query.usertype != "BIKE_MESSENGER" && params.query.usertype != undefined)
			return {
				msg: "usertype must be either ENTERPRISE or just USER!",
				valid: false
			}
		else return {valid: true};		
	},

	reportParamChecker : function (params) {
		var isoDateRegex = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/i;

		if (!params.query.startdate) return {msg: "'startdate' is not available", valid: false}
		else if (!params.query.enddate) return {msg: "'enddate' is not available", valid: false}
		else if (params.query.userid && params.query.userid.length !== 24) return {msg: "'userid' is not available", valid: false}		
		else if (!params.query.startdate.match(isoDateRegex))
			return {
				msg: "startdate '"+params.query.startdate+"' is not in proper ISO date format, ex: 2016-09-19T17:59:59.000Z",
				valid: false
			};
		else if (!params.query.enddate.match(isoDateRegex)) 
			return {
				msg: "enddate '"+params.query.enddate+"' is not in proper ISO date format, ex: 2016-09-19T17:59:59.000Z",
				valid: false
			};
		else return {valid: true};		
	},

	getProductNames : function (PackageList) {
		var packages = PackageList.map(function (package) {
			return  "Name: " + package.Item + 
					", Quantity :" + package.Quantity + 
					", Price: " + package.Price + 
					", Weight: " + package.Weight;
		});
		var package = "";
		for (var i = packages.length - 1; i >= 0; i--) {
			package += packages[i] + "\n";
		}
		return package;
	},

	getDeliveryPersonNames : function (Assets) {
		var assetNames = "";
		for (var i = Object.keys(Assets).length - 1; i >= 0; i--) {
			assetNames = Assets[Object.keys(Assets)[i]].UserName;
		}
		return assetNames;
	},

	getClientType : function (client) {
		if (client === "USER") {
			return "B2C";
		} else if (client === "ENTERPRISE") {
			return "B2B";
		} else if (client === "BIKE_MESSENGER") {
			return "DELIVERYMAN"
		} else return "UNKNOWN";
	},

	getJobTaskPreferenceETA : function (eta, jobTaskPreferenceETA) {
		function findEta(taskETA) {
			return taskETA.Type === eta;
		}
		return jobTaskPreferenceETA.find(findEta);
	},

	getTime : function (time) {
		var moment = require('moment');
		if (time) {
			return moment(time).format('LT');
		} else return "Not Mentioned";
	},

	getDate : function (time) {
		var moment = require('moment');
		if (time) {
			return moment(time).format('LL')
		} else return "Not Mentioned";
	},

	getHoursDifference: function (startTime, endTime) {
		var moment = require('moment');	
		if (!startTime || !endTime) return "-"
		return moment.duration(moment(startTime).diff(moment(endTime))).asHours();
	}
}