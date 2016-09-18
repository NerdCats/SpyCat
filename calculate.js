module.exports = {

	summaryReport : function function_name(jobs) {
		var report = {}
		for (var i = jobs.length - 1; i >= 0; i--) {
			var key = jobs[i].User.UserName;
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
				report[key].TotalProductPrice += parseInt(jobs[i].Order.OrderCart.SubTotal);				
				report[key].TotalDeliveryCharge += parseInt(jobs[i].Order.OrderCart.ServiceCharge);
				
				switch(jobs[i].State){
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
		}
		return report;
	}
}