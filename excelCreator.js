module.exports = {

	getSummaryReport : function (report, callback) {
		var excelbuilder = require('msexcel-builder');
		var directoryName = __dirname + "/excel/";
		var workbookName = Date.now().toString() + 'sample.xlsx';
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
	}
}