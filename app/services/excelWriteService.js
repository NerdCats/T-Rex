(function () {
	'use strict';

	app.service('excelWriteService', excelWriteService);

	function excelWriteService(queryService, $http){

		var JOBS_FOR_REPORT = [];
		var REPORT_ERROR_COUNTER = 0;
		function getReport(searchParam) {			
			var url = queryService.getOdataQuery(searchParam);
			$http({
				method: 'GET',
				url: url
			}).then(function (response) {
				angular.forEach(response.data.data, function (job, index) {
					JOBS_FOR_REPORT.push(job);
				});
				if (response.data.pagination.NextPage) {
					searchParam.page += 1;
					getReport(searchParam);
				} else {
					downloadExcelWorkOrder(JOBS_FOR_REPORT);
					JOBS_FOR_REPORT = [];
				}
			}, function (error) {
				REPORT_ERROR_COUNTER += 1;
				if (REPORT_ERROR_COUNTER < 3) {
					getReport(page);					
				} else {
					// errMsg = "Couldn't Generate Report, Try sometime later!";
					console.log("Couldn't Generate Report, Try sometime later!");
				}
			});
		}

		function downloadExcelWorkOrder(JobsForReport) {
			var filename = "Workorder.xlsx" + new Date().toDateString() + ".xlsx";			
			var excelObjectArray = [];
			var excelHeading = [];
			excelHeading.push("HRID");
			excelHeading.push("User");
			excelHeading.push("ReferenceInvoiceId");
			excelHeading.push("Recipient Name");
			excelHeading.push("PhoneNumber");
			excelHeading.push("Pickup Address");
			excelHeading.push("Delivery Address");
			excelHeading.push("TotalToPrice");
			excelHeading.push("NoteToDeliveryMan");
			excelObjectArray.push(excelHeading);
			
			angular.forEach(JobsForReport, function (job, key) {
				var excelRow = [];
				excelRow.push(job.HRID);
				excelRow.push(job.User.UserName);
				excelRow.push(job.Order.ReferenceInvoiceId);
				if (job.Order.BuyerInfo) {
					excelRow.push(job.Order.BuyerInfo.Name);
				} else {
					excelRow.push("");
				}
				if (job.Order.BuyerInfo && job.Order.BuyerInfo.PhoneNumber) {
					excelRow.push(job.Order.BuyerInfo.PhoneNumber);
				} else {
					excelRow.push("");
				}
				if(job.Order.From.Address === null){
					excelRow.push("No pickup address has been given!")
				} else {
					excelRow.push(job.Order.From.Address);
				}
				if (job.Order.BuyerInfo && job.Order.BuyerInfo.Address) {
					excelRow.push(job.Order.To.Address);
				} else {
					excelRow.push(job.Order.To.Address);
				}
				excelRow.push(job.Order.OrderCart.TotalToPay);
				excelRow.push(job.Order.NoteToDeliveryMan);

				excelObjectArray.push(excelRow);
			});

			var rowCount = JobsForReport.length + 1;
			var columnCount = 6;
			var options = [
				    {
				      "s": { "r": rowCount, "c": 0 },
				      "e": { "r": rowCount, "c": 6 }
				    }
				 ]
			var data = [excelObjectArray, options];
			export_excel(data, 'xlsx', filename);
		};


		function generateArray(table) {
		    var out = [];
		    var rows = table.getElementsByTagName('tr');
		    var ranges = [];
		    for (var R = 0; R < rows.length; ++R) {
		        var outRow = [];
		        var row = rows[R];
		        var columns = row.getElementsByTagName('td');
		        if (!columns.length) columns = row.getElementsByTagName('td');
		        for (var C = 0; C < columns.length; ++C) {
		            var cell = columns[C];
		            var colspan = cell.getAttribute('colspan');
		            var rowspan = cell.getAttribute('rowspan');
		            var cellValue = cell.innerText;
		            if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

		            //Skip ranges
		            ranges.forEach(function(range) {
		                if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
		                    for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
		                }
		            });

		            //Handle Row Span
		            if (rowspan || colspan) {
		                rowspan = rowspan || 1;
		                colspan = colspan || 1;
		                ranges.push({
		                    s: {
		                        r: R,
		                        c: outRow.length
		                    },
		                    e: {
		                        r: R + rowspan - 1,
		                        c: outRow.length + colspan - 1
		                    }
		                });
		            };

		            //Handle Value
		            outRow.push(cellValue !== "" ? cellValue : null);

		            //Handle Colspan
		            if (colspan)
		                for (var k = 0; k < colspan - 1; ++k) outRow.push(null);
		        }
		        out.push(outRow);
		    }
		    return [out, ranges];
		};

		function datenum(v /*:Date*/ , date1904 /*:?boolean*/ ) /*:number*/ {
		    var epoch = v.getTime();
		    if (date1904) epoch += 1462 * 24 * 60 * 60 * 1000;
		    return (epoch + 2209161600000) / (24 * 60 * 60 * 1000);
		};

		function sheet_from_array_of_arrays(data, opts) {
		    var ws = {};
		    var range = {
		        s: {
		            c: 10000000,
		            r: 10000000
		        },
		        e: {
		            c: 0,
		            r: 0
		        }
		    };
		    for (var R = 0; R != data.length; ++R) {
		        for (var C = 0; C != data[R].length; ++C) {
		            if (range.s.r > R) range.s.r = R;
		            if (range.s.c > C) range.s.c = C;
		            if (range.e.r < R) range.e.r = R;
		            if (range.e.c < C) range.e.c = C;
		            var cell = {
		                v: data[R][C]
		            };
		            if (cell.v == null) continue;
		            var cell_ref = XLSX.utils.encode_cell({
		                c: C,
		                r: R
		            });

		            if (typeof cell.v === 'number') cell.t = 'n';
		            else if (typeof cell.v === 'boolean') cell.t = 'b';
		            else if (cell.v instanceof Date) {
		                cell.t = 'n';
		                cell.z = XLSX.SSF._table[14];
		                cell.v = datenum(cell.v);
		            } else cell.t = 's';

		            ws[cell_ref] = cell;
		        }
		    }
		    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
		    return ws;
		}

		function Workbook() {
		    if (!(this instanceof Workbook)) return new Workbook();
		    this.SheetNames = [];
		    this.Sheets = {};
		}

		function s2ab(s) {
		    if (typeof ArrayBuffer !== 'undefined') {
		        var buf = new ArrayBuffer(s.length);
		        var view = new Uint8Array(buf);
		        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
		        return buf;
		    } else {
		        var buf = new Array(s.length);
		        for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
		        return buf;
		    }
		}

		function export_table_to_excel(id, type, fn) {
			var theTable = document.getElementById(id);
		    var oo = generateArray(theTable);
		    console.log(JSON.stringify(oo));
		    export_excel(oo, type, fn);
		}		

		function export_excel(oo, type, fn) {		    
		    var ranges = oo[1];

		    /* original data */
		    var data = oo[0];
		    var ws_name = "SheetJS";

		    var wb = new Workbook(),
		        ws = sheet_from_array_of_arrays(data);

		    /* add ranges to worksheet */
		    ws['!merges'] = ranges;

		    /* add worksheet to workbook */
		    wb.SheetNames.push(ws_name);
		    wb.Sheets[ws_name] = ws;

		    var wbout = XLSX.write(wb, {
		        bookType: type,
		        bookSST: false,
		        type: 'binary'
		    });
		    var fname = fn || 'test.' + type;
		    try {
		        saveAs(new Blob([s2ab(wbout)], {
		            type: "application/octet-stream"
		        }), fname);
		    } catch (e) {
		        if (typeof console != 'undefined') console.log(e, wbout);
		    }
		    return wbout;
		}

		return {
			export_table_to_excel: export_table_to_excel,
			export_excel: export_excel,
			getReport: getReport,
			downloadExcelWorkOrder: downloadExcelWorkOrder
		}
	}	
})();