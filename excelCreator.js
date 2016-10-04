module.exports = {

	getSummaryReport: function (report) {
		var excelbuilder = require('msexcel-builder');
		var directoryName = __dirname + "/excel/";
		var workbookName = Date.now().toString() + 'summary.xlsx';
		var reportFileName = directoryName + workbookName;

	 	var workbook = excelbuilder.createWorkbook(directoryName, workbookName);					 	
	 	var sheet1 = workbook.createSheet('sheet1', 10, 12);
	 	sheet1.set(1, 1, 'Name');
	 	sheet1.set(2, 1, 'Delivery');
	 	sheet1.set(3, 1, 'Pending');
	 	sheet1.set(4, 1, 'InProgress');
	 	sheet1.set(5, 1, 'Completed');
	 	sheet1.set(6, 1, 'Cancelled');
	 	sheet1.set(7, 1, 'ProductPrice');
	 	sheet1.set(8, 1, 'DeliveryCharge');
		for (var row = 2; row <= 10; row++) {
			var reportBaseIndex = row - 2;
			var key = Object.keys(report)[reportBaseIndex];
			sheet1.set(1, row, key);
			sheet1.set(2, row, report[key].TotalDelivery);
		 	sheet1.set(3, row, report[key].TotalPending);
		 	sheet1.set(4, row, report[key].TotalInProgress);
		 	sheet1.set(5, row, report[key].TotalCompleted);
		 	sheet1.set(6, row, report[key].TotalCancelled);
		 	sheet1.set(7, row, report[key].TotalProductPrice);
		 	sheet1.set(8, row, report[key].TotalDeliveryCharge);
		}

		return {
			workbookFilePath: reportFileName,
			workbook: workbook
		}
	},

	getDetailsReport: function (report) {
		var excelbuilder = require('msexcel-builder');
		var directoryName = __dirname + "/excel/";
		var workbookName = Date.now().toString() + 'details.xlsx';
		var reportFileName = directoryName + workbookName;
		
		var workbook = excelbuilder.createWorkbook(directoryName, workbookName);					 	
	 	var sheet1 = workbook.createSheet('sheet1', 34, report.length);

	 	sheet1.set(1, 1, 'TrackingNumber');
		sheet1.set(2, 1, 'Client');
		sheet1.set(3, 1, 'OrderingDate');
		sheet1.set(4, 1, 'OrderingTime');
		sheet1.set(5, 1, 'DeliveryDate');
		sheet1.set(6, 1, 'DeliveryType');
		sheet1.set(7, 1, 'UserName');
		sheet1.set(8, 1, 'UserPhone');
		sheet1.set(9, 1, 'PickupAddress');
		sheet1.set(10, 1, 'PickupArea');
		sheet1.set(11, 1, 'DeliveryAddress');
		sheet1.set(12, 1, 'DeliveryArea');
		sheet1.set(13, 1, 'Product');
		sheet1.set(14, 1, 'Weight');
		sheet1.set(15, 1, 'TotalProductPrice');
		sheet1.set(16, 1, 'DeliveryCharge');
		sheet1.set(17, 1, 'VAT');
		sheet1.set(18, 1, 'Total');
		sheet1.set(19, 1, 'DeliveryPerson');
		sheet1.set(20, 1, 'PickupStartDate');
		sheet1.set(21, 1, 'PickupStartTime');
		sheet1.set(22, 1, 'PickupCompleteDate');
		sheet1.set(23, 1, 'PickupCompleteTime');
		sheet1.set(24, 1, 'DeliveryStartTime');
		sheet1.set(25, 1, 'DeliveryCompleteTime');
		sheet1.set(26, 1, 'TotalDeliveryTime');
		sheet1.set(27, 1, 'Status');
		sheet1.set(28, 1, 'PaymentStatus');
		sheet1.set(29, 1, 'VendorInvoiceNo');
		sheet1.set(30, 1, 'Commission');
		sheet1.set(31, 1, 'CashRecieved');
		sheet1.set(32, 1, 'KM');
		sheet1.set(33, 1, 'ProductType');
		sheet1.set(34, 1, 'Comment');

		for (var row = 2; row < report.length; row++) {	
			var e = report[row-2];

			console.log(row-2)

			sheet1.set(1, row, e.trackingNumber);
			sheet1.set(2, row, e.Client);
			sheet1.set(3, row, e.OrderingDate);
			sheet1.set(4, row, e.OrderingTime);
			sheet1.set(5, row, e.DeliveryDate);
			sheet1.set(6, row, e.DeliveryType);
			sheet1.set(7, row, e.UserName);
			sheet1.set(8, row, e.UserPhone);
			sheet1.set(9, row, e.PickupAddress);
			sheet1.set(10, row, e.PickupArea);
			sheet1.set(11, row, e.DeliveryAddress);
			sheet1.set(12, row, e.DeliveryArea);
			sheet1.set(13, row, e.Product);
			sheet1.set(14, row, e.Weight);
			sheet1.set(15, row, e.TotalProductPrice);
			sheet1.set(16, row, e.DeliveryCharge);
			sheet1.set(17, row, e.VAT);
			sheet1.set(18, row, e.Total);
			sheet1.set(19, row, e.DeliveryPerson);
			sheet1.set(20, row, e.PickupStartDate);
			sheet1.set(21, row, e.PickupStartTime);
			sheet1.set(22, row, e.PickupCompleteDate);
			sheet1.set(23, row, e.PickupCompleteTime);
			sheet1.set(24, row, e.DeliveryStartTime);
			sheet1.set(25, row, e.DeliveryCompleteTime);
			sheet1.set(26, row, e.TotalDeliveryTime);
			sheet1.set(27, row, e.Status);
			sheet1.set(28, row, e.PaymentStatus);
			sheet1.set(29, row, e.VendorInvoiceNo);
			sheet1.set(30, row, e.Commission);
			sheet1.set(31, row, e.CashRecieved);
			sheet1.set(32, row, e.KM);
			sheet1.set(33, row, e.ProductType);
			sheet1.set(34, row, e.Comment);

		}

		return {
			workbookFilePath: reportFileName,
			workbook: workbook
		}

	}
}