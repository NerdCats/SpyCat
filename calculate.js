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
		
		var utility = require('./utility');
		var entry = {};

		entry.trackingNumber = job.HRID;

		if (job.Order.Type == "ClassifiedDelivery" && job.Order.Variant == "enterprise") {
			entry.DeliveryType = "B2B Delivery";	
		} else if (job.Order.Type == "ClassifiedDelivery" && job.Order.Variant == "default") {
			entry.DeliveryType = "B2B with Cash Delivery";
		} else {
			entry.DeliveryType = "Delivery";
		}
		
		entry.Status = job.State;
		entry.PaymentStatus = job.PaymentStatus;

		entry.OrderingDate = utility.getDate(job.CreateTime);
		entry.OrderingTime = utility.getTime(job.CreateTime);

		entry.CompletionETADate = utility.getDate(job.Order.ETA);
		entry.CompletionETATime = utility.getTime(job.Order.ETA);
		if (job.Order.ETA !== undefined) {
			entry.CompletionETADate = utility.getDate(job.ETA);
			entry.CompletionETATime = utility.getTime(job.ETA);
		}
		
		entry.CompleteDate = utility.getDate(job.CompletionTime);
		entry.CompleteTime = utility.getTime(job.CompletionTime);

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
		entry.SpecialNote = job.Order.NoteToDeliveryMan;
		
		
		// Pickup Info
		entry.PickupStatus = job.Tasks[1].State;		
		entry.PickupETADate;
		entry.PickupETATime = "Not Mentioned";
		if (job.Order.JobTaskETAPreference !== null && job.Order.JobTaskETAPreference !== undefined && job.Order.JobTaskETAPreference.length > 0) {
			var pickupEta = utility.getJobTaskPreferenceETA("PackagePickUp" ,job.Order.JobTaskETAPreference);
			if (pickupEta) {
				entry.PickupETADate = utility.getDate(pickupEta.ETA);
				entry.PickupETATime = utility.getTime(pickupEta.ETA);
			}
		}
		entry.PickupStartDate = utility.getDate(job.Tasks[1].InitiationTime);
		entry.PickupStartTime = utility.getTime(job.Tasks[1].InitiationTime);
		entry.PickupCompleteDate = utility.getDate(job.Tasks[1].CompletionTime);
		entry.PickupCompleteTime = utility.getTime(job.Tasks[1].CompletionTime);
		entry.TotalPickUpTime = utility.getHoursDifference(job.Tasks[1].InitiationTime, job.Tasks[1].CompletionTime);
		


		// Delivery Info
		var lastDeliveryTask = job.Tasks.length - 1;
		var variantString = '';
		var lastTaskvariant = job.Tasks[lastDeliveryTask].Variant;
		if(lastTaskvariant !== 'default' && lastTaskvariant !== 'retry'){
			lastTaskvariant = titleCase(lastTaskvariant);
			variantString = lastTaskvariant + " ";
		}

			entry.DeliveryStatus = variantString + job.Tasks[lastDeliveryTask].State + " ";
		
		entry.DeliveryETADate;
		entry.DeliveryETATime = "Not Mentioned";
		
		if (job.Order.JobTaskETAPreference !== null && job.Order.JobTaskETAPreference !== undefined && job.Order.JobTaskETAPreference.length > 0) {
			var deliveryEta = utility.getJobTaskPreferenceETA("Delivery" ,job.Order.JobTaskETAPreference);			
			if (deliveryEta) {
				entry.DeliveryETADate = utility.getDate(deliveryEta.ETA);
				entry.DeliveryETATime = utility.getTime(deliveryEta.ETA);
			}
		}

		entry.DeliveryStartDate = utility.getDate(job.Tasks[2].InitiationTime);
		entry.DeliveryStartTime = utility.getTime(job.Tasks[2].InitiationTime);
		entry.DeliveryCompleteDate = utility.getDate(job.Tasks[2].CompletionTime);
		entry.DeliveryCompleteTime = utility.getTime(job.Tasks[2].CompletionTime);
		entry.TotalDeliveryTime = utility.getHoursDifference(job.Tasks[2].InitiationTime, job.Tasks[2].CompletionTime);



		// Cash Delivery Info
		entry.CashDeliveryStatus = "Not Applicable";
		entry.CashDeliveryStartDate;
		entry.CashDeliveryStartTime = "Not Applicable";
		entry.CashDeliveryCompleteDate;
		entry.CashDeliveryCompleteTime = "Not Applicable";
		entry.TotalCashDeliveryTime = "Not Applicable";
		entry.CashDeliveryETADate;
		entry.CashDeliveryETATime = "Not Applicable";
		if (job.Tasks[3]) {
			entry.CashDeliveryStatus = job.Tasks[3].State;

			entry.CashDeliveryETADate;
			entry.CashDeliveryETATime = "Not Mentioned";
			if (job.Order.JobTaskETAPreference !== null && job.Order.JobTaskETAPreference !== undefined && job.Order.JobTaskETAPreference.length > 0) {
				var cashDeliveryEta = utility.getJobTaskPreferenceETA("SecureCashDelivery" ,job.Order.JobTaskETAPreference);				
				if (cashDeliveryEta) {
					entry.CashDeliveryETADate = utility.getDate(cashDeliveryEta.ETA);
					entry.CashDeliveryETATime = utility.getTime(cashDeliveryEta.ETA);
				}
			}
			entry.CashDeliveryStartDate = utility.getDate(job.Tasks[3].InitiationTime);
			entry.CashDeliveryStartTime = utility.getTime(job.Tasks[3].InitiationTime);
			entry.CashDeliveryCompleteDate = utility.getDate(job.Tasks[3].CompletionTime);
			entry.CashDeliveryCompleteTime = utility.getTime(job.Tasks[3].CompletionTime);
			entry.TotalCashDeliveryTime = utility.getHoursDifference(job.Tasks[3].InitiationTime, job.Tasks[3].CompletionTime);
		}
		

		
		entry.VendorInvoiceNo = job.Order.ReferenceInvoiceId;
		entry.Commission = null;
		entry.CashRecieved = null;
		entry.KM = null;
		entry.ProductType = null;
		entry.Comment = job.HRIDregregreg;


		function titleCase(str) {
			return str.charAt(0).toUpperCase() + str.slice(1);
		}

		return entry;
	}
}