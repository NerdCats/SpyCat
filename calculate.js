module.exports = {

	summaryReport : function function_name(params, report, job) {		
		var key = job.User.UserName;
		if (params.query.usertype === "BIKE_MESSENGER") {			
			if (Object.keys(job.Assets) && Object.keys(job.Assets).length !== 0) {
				// FIXME: more than one asset can be assigned to a job
				var assetKey = Object.keys(job.Assets)[0];
				key = job.Assets[assetKey].UserName;
			} else {
				key = "Not Assigned";
			}
		}
		if (params.query.usertype === "BIKE_MESSENGER" && params.query.userid) {			
			key = job.Assets[params.query.userid].UserName;
		}
		if ((params.query.usertype === "USER" || params.query.usertype === "ENTERPRISE") && params.query.userid) {			
			key = job.User.UserName;
		}
		if (report[key] === undefined) {
			report[key] = {};
			report[key].TotalDelivery = 0;
			report[key].TotalProductPrice = 0;
			report[key].TotalDeliveryCharge = 0;
			report[key].TotalPending = 0;
			report[key].TotalInProgress = 0;
			report[key].TotalCompleted = 0;
			report[key].TotalCancelled = 0;				
		}

		if (report[key] !== undefined) {
			report[key].TotalDelivery += 1;
			report[key].TotalProductPrice += parseInt(job.Order.OrderCart.SubTotal);				
			report[key].TotalDeliveryCharge += parseInt(job.Order.OrderCart.ServiceCharge);
			
			switch(job.State){
				case "ENQUEUED":
					report[key].TotalPending += 1;
					break;
				case "IN_PROGRESS":
					report[key].TotalInProgress += 1;
					break;
				case "COMPLETED":
					report[key].TotalCompleted += 1;
					break;
				case "CANCELLED":
					report[key].TotalCancelled += 1;
					break;
				default:
					break;
			}
		}		
		return report;
	}
}