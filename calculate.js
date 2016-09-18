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
			}

			if (report[key] !== undefined) {
				report[key].TotalDelivery += 1;
				report[key].TotalProductPrice += parseInt(jobs[i].Order.OrderCart.SubTotal);				
				report[key].TotalDeliveryCharge += parseInt(jobs[i].Order.OrderCart.ServiceCharge);				
			}			
		}
		return report;
	}
}