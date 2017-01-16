module.exports = {

	getSummaryReport: function (report) {
		var excelbuilder = require('msexcel-builder');
		var directoryName = __dirname + "/excel/";
		var workbookName = Date.now().toString() + 'summary.xlsx';
		var reportFileName = directoryName + workbookName;

	 	var workbook = excelbuilder.createWorkbook(directoryName, workbookName);
	 	console.log(Object.keys(report).length)
	 	var sheet1 = workbook.createSheet('sheet1', 8, Object.keys(report).length+1);
	 	sheet1.set(1, 1, 'Name');
	 	sheet1.set(2, 1, 'Delivery');
	 	sheet1.set(3, 1, 'Pending');
	 	sheet1.set(4, 1, 'InProgress');
	 	sheet1.set(5, 1, 'Completed');
	 	sheet1.set(6, 1, 'Cancelled');
	 	sheet1.set(7, 1, 'ProductPrice');
	 	sheet1.set(8, 1, 'DeliveryCharge');
	 	console.log(Object.keys(report).length);
		for (var row = 2; row <= Object.keys(report).length + 1; row++) {
			var reportBaseIndex = row - 2;			
			var key = Object.keys(report)[reportBaseIndex];
			sheet1.set(1, row, key);
			if (report[key].TotalDelivery === undefined) {
				console.log()
				console.log(report[key])
			}
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
	 	var sheet1 = workbook.createSheet('sheet1', 56, report.length + 1);

	 	sheet1.set(1, 1, 'trackingNumber');
		sheet1.set(2, 1, 'DeliveryType');
		sheet1.set(3, 1, 'OrderingDate');
		sheet1.set(4, 1, 'OrderingTime');
		sheet1.set(5, 1, 'CompletionETADate');
		sheet1.set(6, 1, 'CompletionETATime');
		sheet1.set(7, 1, 'CompleteDate');
		sheet1.set(8, 1, 'CompleteTime');
		sheet1.set(9, 1, 'ClientType');
		sheet1.set(10, 1, 'UserName');
		sheet1.set(11, 1, 'UserPhone');
		sheet1.set(12, 1, 'DeliveryPerson');
		sheet1.set(13, 1, 'PickupAddress');
		sheet1.set(14, 1, 'PickupArea');
		sheet1.set(15, 1, 'DeliveryAddress');
		sheet1.set(16, 1, 'DeliveryArea');
		sheet1.set(17, 1, 'ProductDescription');
		sheet1.set(18, 1, 'Product');
		sheet1.set(19, 1, 'Weight');
		sheet1.set(20, 1, 'TotalProductPrice');
		sheet1.set(21, 1, 'DeliveryCharge');
		sheet1.set(22, 1, 'VAT');
		sheet1.set(23, 1, 'Total');
		sheet1.set(24, 1, 'PickupStatus');
		sheet1.set(25, 1, 'PickupETADate');
		sheet1.set(26, 1, 'PickupETATime');
		sheet1.set(27, 1, 'PickupStartDate');
		sheet1.set(28, 1, 'PickupStartTime');
		sheet1.set(29, 1, 'PickupCompleteDate');
		sheet1.set(30, 1, 'PickupCompleteTime');
		sheet1.set(31, 1, 'TotalPickUpTime');
		sheet1.set(32, 1, 'DeliveryStatus');
		sheet1.set(33, 1, 'DeliveryETADate');
		sheet1.set(34, 1, 'DeliveryETATime');
		sheet1.set(35, 1, 'DeliveryStartDate');
		sheet1.set(36, 1, 'DeliveryStartTime');
		sheet1.set(37, 1, 'DeliveryCompleteDate');
		sheet1.set(38, 1, 'DeliveryCompleteTime');
		sheet1.set(39, 1, 'TotalDeliveryTime');
		sheet1.set(40, 1, 'CashDeliveryStatus');
		sheet1.set(41, 1, 'CashDeliveryStartDate');
		sheet1.set(42, 1, 'CashDeliveryStartTime');
		sheet1.set(43, 1, 'CashDeliveryCompleteDate');
		sheet1.set(44, 1, 'CashDeliveryCompleteTime');
		sheet1.set(45, 1, 'TotalCashDeliveryTime');
		sheet1.set(46, 1, 'CashDeliveryETADate');
		sheet1.set(47, 1, 'CashDeliveryETATime');
		sheet1.set(48, 1, 'Status');
		sheet1.set(49, 1, 'PaymentStatus');
		sheet1.set(50, 1, 'VendorInvoiceNo');
		sheet1.set(51, 1, 'Commission');
		sheet1.set(52, 1, 'CashRecieved');
		sheet1.set(53, 1, 'KM');
		sheet1.set(54, 1, 'ProductType');
		sheet1.set(55, 1, 'Comment');
		sheet1.set(56, 1, 'NoteToDeliveryMan');

		console.log(report.length);
		for (var row = 2; row <= (report.length+1); row++) {
			var e = report[row-2];		
			console.log(row-2);
			sheet1.set(1, row, e.trackingNumber);
			sheet1.set(2, row, e.DeliveryType);
			sheet1.set(3, row, e.OrderingDate);
			sheet1.set(4, row, e.OrderingTime);
			sheet1.set(5, row, e.CompletionETADate);
			sheet1.set(6, row, e.CompletionETATime);
			sheet1.set(7, row, e.CompleteDate);
			sheet1.set(8, row, e.CompleteTime);
			sheet1.set(9, row, e.ClientType);
			sheet1.set(10, row, e.UserName);
			sheet1.set(11, row, e.UserPhone);
			sheet1.set(12, row, e.DeliveryPerson);
			sheet1.set(13, row, e.PickupAddress);
			sheet1.set(14, row, e.PickupArea);
			sheet1.set(15, row, e.DeliveryAddress);
			sheet1.set(16, row, e.DeliveryArea);
			sheet1.set(17, row, e.ProductDescription);
			sheet1.set(18, row, e.Product);
			sheet1.set(19, row, e.Weight);
			sheet1.set(20, row, e.TotalProductPrice);
			sheet1.set(21, row, e.DeliveryCharge);
			sheet1.set(22, row, e.VAT);
			sheet1.set(23, row, e.Total);
			sheet1.set(24, row, e.PickupStatus);
			sheet1.set(25, row, e.PickupETADate);
			sheet1.set(26, row, e.PickupETATime);
			sheet1.set(27, row, e.PickupStartDate);
			sheet1.set(28, row, e.PickupStartTime);
			sheet1.set(29, row, e.PickupCompleteDate);
			sheet1.set(30, row, e.PickupCompleteTime);
			sheet1.set(31, row, e.TotalPickUpTime);
			sheet1.set(32, row, e.DeliveryStatus);
			sheet1.set(33, row, e.DeliveryETADate);
			sheet1.set(34, row, e.DeliveryETATime);
			sheet1.set(35, row, e.DeliveryStartDate);
			sheet1.set(36, row, e.DeliveryStartTime);
			sheet1.set(37, row, e.DeliveryCompleteDate);
			sheet1.set(38, row, e.DeliveryCompleteTime);
			sheet1.set(39, row, e.TotalDeliveryTime);
			sheet1.set(40, row, e.CashDeliveryStatus);
			sheet1.set(41, row, e.CashDeliveryStartDate);
			sheet1.set(42, row, e.CashDeliveryStartTime);
			sheet1.set(43, row, e.CashDeliveryCompleteDate);
			sheet1.set(44, row, e.CashDeliveryCompleteTime);
			sheet1.set(45, row, e.TotalCashDeliveryTime);
			sheet1.set(46, row, e.CashDeliveryETADate);
			sheet1.set(47, row, e.CashDeliveryETATime);
			sheet1.set(48, row, e.Status);
			sheet1.set(49, row, e.PaymentStatus);
			sheet1.set(50, row, e.VendorInvoiceNo);
			sheet1.set(51, row, e.Commission);
			sheet1.set(52, row, e.CashRecieved);
			sheet1.set(53, row, e.KM);
			sheet1.set(54, row, e.ProductType);
			sheet1.set(55, row, e.Comment);
			sheet1.set(56, row, e.SpecialNote);

		}

		return {
			workbookFilePath: reportFileName,
			workbook: workbook
		}
	},
	getDetailsSummaryReport: function (report) {
		var excelbuilder = require('msexcel-builder');
		var directoryName = __dirname + "/excel/";
		var workbookName = Date.now().toString() + 'details.xlsx';
		var reportFileName = directoryName + workbookName;
		
		var workbook = excelbuilder.createWorkbook(directoryName, workbookName);					 	
	 	var sheet1 = workbook.createSheet('sheet1', 16, report.length + 1);

	 	sheet1.set(1, 1, 'TrackingNumber');
		sheet1.set(2, 1, 'VendorInvoiceNo');
		sheet1.set(3, 1, 'Status');
		sheet1.set(4, 1, 'DeliveryType');
		sheet1.set(5, 1, 'OrderingDate');						
		sheet1.set(6, 1, 'CompleteDate');		
		sheet1.set(7, 1, 'UserName');		
		sheet1.set(8, 1, 'PickupAddress');		
		sheet1.set(9, 1, 'DeliveryAddress');
		sheet1.set(10, 1, 'Product');
		sheet1.set(11, 1, 'Weight');
		sheet1.set(12, 1, 'DeliveryCharge');		
		sheet1.set(13, 1, 'Commission');		
		sheet1.set(14, 1, 'TotalProductPrice');
		sheet1.set(15, 1, 'Total');		
		sheet1.set(16, 1, 'PaymentStatus');		
		for (var row = 2; row <= (report.length+1); row++) {
			var e = report[row-2];		
			console.log(row-2);
			sheet1.set(1, row, e.trackingNumber);			
			sheet1.set(2, row, e.VendorInvoiceNo);
			sheet1.set(3, row, e.Status);
			sheet1.set(4, row, e.DeliveryType);
			sheet1.set(5, row, e.OrderingDate);
			sheet1.set(6, row, e.CompleteDate);			
			sheet1.set(7, row, e.UserName);
			sheet1.set(8, row, e.PickupAddress);
			sheet1.set(9, row, e.DeliveryAddress);			
			sheet1.set(10, row, e.Product);
			sheet1.set(11, row, e.Weight);
			sheet1.set(12, row, e.DeliveryCharge);			
			sheet1.set(13, row, e.Commission);			
			sheet1.set(14, row, e.TotalProductPrice);
			sheet1.set(15, row, e.Total);			
			sheet1.set(16, row, e.PaymentStatus);			
		}

		return {
			workbookFilePath: reportFileName,
			workbook: workbook
		}
	}
}