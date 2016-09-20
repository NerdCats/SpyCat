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
	}
}