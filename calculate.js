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
	},

	detailsReport: function (report, job) {
		var moment = require('moment');
		var utility = require('./utility');
		var entry = {};

		entry.trackingNumber = job.HRID
		entry.DeliveryType = job.Order.Type;

		entry.OrderingDate = moment(job.CreateTime).format('LL');
		entry.OrderingTime = moment(job.CreateTime).format('LT');

		entry.CompletionETADate = moment(job.ETA).format('LL');
		entry.CompletionETATime = moment(job.ETA).format('LT');
		
		entry.CompleteDate = moment(job.CompletionTime).format('LL');
		entry.CompleteTime = moment(job.CompletionTime).format('LT');

		// User, DeliveryMan info
		entry.ClientType = utility.getClientType(job.User.Type);
		entry.UserName = job.User.UserName;
		entry.UserPhone = job.User.PhoneNumber;
		entry.DeliveryPerson = utility.getDeliveryPersonNames(job.Assets);

		entry.PickupAddress = job.Order.From.Address;
		entry.PickupArea = job.Order.From.Locality;
		entry.DeliveryAddress = job.Order.To.Address;
		entry.DeliveryArea = job.Order.To.Locality;


		// Package Info
		entry.ProductDescription = job.Order.Description;
		entry.Product = utility.getProductNames(job.Order.OrderCart.PackageList);		
		entry.Weight = job.Order.OrderCart.TotalWeight;
		entry.TotalProductPrice = job.Order.OrderCart.SubTotal;
		entry.DeliveryCharge = job.Order.OrderCart.ServiceCharge;
		entry.VAT = job.Order.OrderCart.TotalVATAmount;
		entry.Total = job.Order.OrderCart.TotalToPay;
		
		
		// Pickup Info
		entry.PickupStatus = job.Tasks[1].State;		
		entry.PickupETADate = "Not Mentioned";
		entry.PickupETATime = "Not Mentioned";
		if (job.Order.JobTaskETAPreference !== undefined && job.Order.JobTaskETAPreference.length > 0) {
			var pickupEta = utility.getJobTaskPreferenceETA("PackagePickUp" ,job.Order.JobTaskETAPreference);
			if (pickupEta) {
				entry.PickupETADate = moment(pickupEta.ETA).format('LL');
				entry.PickupETATime = moment(pickupEta.ETA).format('LT');				
			}
		}
		entry.PickupStartDate = moment(job.Tasks[1].Started).format('LL');
		entry.PickupStartTime = moment(job.Tasks[1].Started).format('LT');
		entry.PickupCompleteDate = moment(job.Tasks[1].Completed).format('LL');
		entry.PickupCompleteTime = moment(job.Tasks[1].Completed).format('LT');
		entry.TotalPickUpTime = moment.duration(moment(job.Tasks[1].Started).diff(moment(job.Tasks[1].Completed))).asHours();
		


		// Delivery Info
		entry.DeliveryStatus = job.Tasks[2].State;
		entry.DeliveryETADate = "Not Mentioned";
		entry.DeliveryETATime = "Not Mentioned";
		
		if (job.Order.JobTaskETAPreference !== undefined && job.Order.JobTaskETAPreference.length > 0) {
			var deliveryEta = utility.getJobTaskPreferenceETA("Delivery" ,job.Order.JobTaskETAPreference);			
			if (deliveryEta) {
				entry.DeliveryETADate = moment(deliveryEta.ETA).format('LL');
				entry.DeliveryETATime = moment(deliveryEta.ETA).format('LT');				
			}
		}

		entry.DeliveryStartDate = moment(job.Tasks[2].Started).format('LL');
		entry.DeliveryStartTime = moment(job.Tasks[2].Started).format('LT');
		entry.DeliveryCompleteDate = moment(job.Tasks[2].Completed).format('LL');
		entry.DeliveryCompleteTime = moment(job.Tasks[2].Completed).format('LT');
		entry.TotalDeliveryTime = moment.duration(moment(job.Tasks[2].Started).diff(moment(job.Tasks[2].Completed))).asHours();



		// Cash Delivery Info
		entry.CashDeliveryStatus = "Not Applicable";
		entry.CashDeliveryStartDate = "Not Applicable";
		entry.CashDeliveryStartTime = "Not Applicable";
		entry.CashDeliveryCompleteDate = "Not Applicable";
		entry.CashDeliveryCompleteTime = "Not Applicable";
		entry.TotalCashDeliveryTime = "Not Applicable";
		entry.CashDeliveryETADate = "Not Applicable";
		entry.CashDeliveryETATime = "Not Applicable";
		if (job.Tasks[3]) {
			entry.CashDeliveryStatus = job.Tasks[3].State;

			entry.CashDeliveryETADate = "Not Mentioned";
			entry.CashDeliveryETATime = "Not Mentioned";
			if (job.Order.JobTaskETAPreference !== undefined && job.Order.JobTaskETAPreference.length > 0) {
				var cashDeliveryEta = utility.getJobTaskPreferenceETA("SecureCashDelivery" ,job.Order.JobTaskETAPreference);				
				if (cashDeliveryEta) {
					entry.CashDeliveryETADate = moment(cashDeliveryEta.ETA).format('LL');
					entry.CashDeliveryETATime = moment(cashDeliveryEta.ETA).format('LT');					
				}
			}
			entry.CashDeliveryStartDate = moment(job.Tasks[3].Started).format('LL');
			entry.CashDeliveryStartTime = moment(job.Tasks[3].Started).format('LT');
			entry.CashDeliveryCompleteDate = moment(job.Tasks[3].Completed).format('LL');
			entry.CashDeliveryCompleteTime = moment(job.Tasks[3].Completed).format('LT');
			entry.TotalCashDeliveryTime = moment.duration(moment(job.Tasks[3].Started).diff(moment(job.Tasks[3].Completed))).asHours();
		}
		
		entry.Status = job.State;
		entry.PaymentStatus = job.PaymentStatus;
		
		entry.VendorInvoiceNo = null;
		entry.Commission = null;
		entry.CashRecieved = null;
		entry.KM = null;
		entry.ProductType = null;
		entry.Comment = null;

		return entry;
	}
}